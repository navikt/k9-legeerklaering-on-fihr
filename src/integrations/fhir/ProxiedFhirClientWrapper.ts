import Practitioner, { PartialPractitioner } from "@/models/Practitioner";
import { R4 } from "@ahryman40k/ts-fhir-types";
import { validateOrThrow } from "@/integrations/fhir/fhirValidator";
import {
    dateTimeResolver,
    dnrFromIdentifiers,
    fnrFromIdentifiers,
    iPractitionerRoleFromListing,
    iResourceListFromArray,
    isRelatedPerson,
    officialHumanNameResolver,
    organizationNumberFromIdentifiers,
    phoneContactResolver,
    postalAddressResolver,
    resolvePractitionerFromIPractitioner,
    resolvePractitionerFromIPractitionerRole,
    resolveRelatedPersonFromIRelatedPerson
} from "@/integrations/fhir/resolvers";
import Patient from "@/models/Patient";
import Client from "fhirclient/lib/Client";
import { clientCopyWithProxyUrl } from "@/integrations/fhir/clientInit";
import { FhirApi } from "@/integrations/fhir/FhirApi";
import Hospital from "@/models/Hospital";
import IncompletePractitioner from "@/models/errors/IncompletePractitioner";
import InitData from "@/models/InitData";
import RelatedPerson from "@/models/RelatedPerson";
import { DocumentReferenceStatusKind, IDocumentReference } from '@ahryman40k/ts-fhir-types/lib/R4';
import { createAndValidateDocumentReferencePayload } from '@/integrations/fhir/utils/payloads';
import { LegeerklaeringDokumentReferanse } from "@/models/LegeerklaeringDokumentReferanse";


export default class ProxiedFhirClientWrapper implements FhirApi {
    private client: Client;

    public constructor(client: Client) {
        const proxyUrl = new URL("/api/fhir/proxy/", new URL(window.location.origin));
        this.client = clientCopyWithProxyUrl(client, proxyUrl)
    }

    public async getHospital(organizationReference: string): Promise<Hospital> {
        const org = validateOrThrow(R4.RTTI_Organization.decode(await this.client.request(organizationReference)))
        const {id, name} = org
        if (id === undefined || id.length === 0 || name === undefined || name.length === 0) {
            throw new Error(`organization (hospital) with reference ${organizationReference} is missing required props (id and/or name)`)
        }
        const organizationNumber = organizationNumberFromIdentifiers(org.identifier || [])
        const address = postalAddressResolver(org.address)
        const phoneNumber = phoneContactResolver(org.telecom)
        return {
            ehrId: id,
            organizationNumber,
            name,
            phoneNumber,
            address,
        }
    }

    public async getPractitioner(): Promise<Practitioner & { readonly organizationReference: string | undefined }> {
        // For DIPS, accessing the client.user.read or similar did not work, have to request the "PractitionerRole" like we do below instead.
        // This seems to contain the Practitioner info we in the smart api demo would get back from client.user.read.
        // I suspect this is a non-standard API call. Will perhaps need to make this more dynamic to adapt to other EHR systems.
        // E.g. perhaps first check if client.user.id is set, and try using the standard client.user.read call if so. If the standard
        // way is not available, go on to try this method. A potential problem with just using client.user.read, though, is that maybe
        // the info about what organization (hospital) the practitioner is working for might not be available then.
        //
        // We use the flat option to directly get a ResourceList back instead of a Bundle wrapper object. Believe this is generally
        // a good option to use, based on explanation at https://docs.smarthealthit.org/client-js/client.html
        const resourceList = iResourceListFromArray(await this.client.request<unknown[]>("PractitionerRole/$getCurrentUser", {flat: true}))
        const iPractitionerRole = iPractitionerRoleFromListing(resourceList)
        if (iPractitionerRole === undefined) {
            throw new Error("No PractitionerRole found in the $getCurrentUser bundle")
        }
        const practitionerFromRole = resolvePractitionerFromIPractitionerRole(iPractitionerRole)
        // If the practitioner info resolved from practitioner role is complete, return it
        if (
            practitionerFromRole.ehrId !== undefined &&
            practitionerFromRole.hprNumber !== undefined &&
            practitionerFromRole.name !== undefined
        ) {
            return {
                ehrId: practitionerFromRole.ehrId,
                hprNumber: practitionerFromRole.hprNumber,
                name: practitionerFromRole.name,
                practitionerRoleId: iPractitionerRole.id,
                activeSystemUser: practitionerFromRole.activeSystemUser === undefined ? true : practitionerFromRole.activeSystemUser,
                organizationReference: iPractitionerRole.organization?.reference
            }
        }
        // Practitioner role did not have complete info, try getting it from Practitioner endpoint
        if (iPractitionerRole?.practitioner?.reference === undefined) {
            throw new Error(`No practitioner reference in PractitionerRole from $getCurrentUser`)
        }
        const iPractitioner = validateOrThrow(R4.RTTI_Practitioner.decode(await this.client.request(iPractitionerRole.practitioner.reference)))
        const practitioner = resolvePractitionerFromIPractitioner(iPractitioner)
        const mergedPractitioner: PartialPractitioner = {
            ...practitionerFromRole,
            ...practitioner,
        }
        if (
            mergedPractitioner.ehrId !== undefined &&
            mergedPractitioner.hprNumber !== undefined &&
            mergedPractitioner.name !== undefined
        ) {
            return {
                ehrId: mergedPractitioner.ehrId,
                hprNumber: mergedPractitioner.hprNumber,
                practitionerRoleId: iPractitionerRole.id,
                name: mergedPractitioner.name,
                activeSystemUser: mergedPractitioner.activeSystemUser,
                organizationReference: iPractitionerRole.organization?.reference
            }
        } else {
            throw new IncompletePractitioner(mergedPractitioner)
        }
    }

    /**
     * Get the patients related persons, e.g. the parents of a child patient.
     * @param patientEhrId
     * @private
     */
    private async getRelatedPersons(patientEhrId: string): Promise<RelatedPerson[]> {
        // Using flat: true in request options to get an array response instead of maybe a bundle (https://docs.smarthealthit.org/client-js/client.html)
        const listing = iResourceListFromArray(await this.client.request<unknown[]>(`RelatedPerson?patient=${patientEhrId}`, {flat: true}))
        const relatedPersons: RelatedPerson[] = listing
            .flatMap(r => {
                if (R4.RTTI_RelatedPerson.is(r)) {
                    const rp = resolveRelatedPersonFromIRelatedPerson(r)
                    if (isRelatedPerson(rp)) {
                        return [rp]
                    }
                }
                return []
            })
        return relatedPersons
    }

    public blobToBase64 = (file: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(",")[1]);
            };

            reader.readAsDataURL(file);
            reader.onerror = reject;
        });

    public async createDocument(patientEhrId: string, providerEhrId: string, hospitalEhrId: string, description: LegeerklaeringDokumentReferanse, pdf: Blob): Promise<boolean> {
        const pdfAsBase64 = await this.blobToBase64(pdf);
        const documentReference = createAndValidateDocumentReferencePayload(
            patientEhrId,
            providerEhrId,
            hospitalEhrId,
            DocumentReferenceStatusKind._current,
            description,
            [
                {
                    "attachment": {
                        "contentType": "application/pdf",
                        "data": pdfAsBase64,
                        "title": "title",
                    }
                }
            ]
        )

        await this.client.request<IDocumentReference>(
            {
                url: "DocumentReference",
                method: "POST",
                body: JSON.stringify(documentReference),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return true
    }

    public async getPatient(): Promise<Patient> {
        const patient = validateOrThrow(R4.RTTI_Patient.decode(await this.client.patient.read()));
        const name = officialHumanNameResolver(patient.name)
        const ehrId = patient.id
        const fnr = patient.identifier instanceof Array && (fnrFromIdentifiers(patient.identifier) || dnrFromIdentifiers(patient.identifier)) || null
        const birthDate = dateTimeResolver(patient.birthDate)
        const caretakers = await this.getRelatedPersons(patient.id!!);

        if (ehrId !== undefined && name !== undefined) {
            return {
                name,
                ehrId,
                fnr,
                birthDate,
                caretakers,
            }
        } else {
            throw new Error(`Patient returned from EHR system missing id and/or name (id: ${ehrId})`);
        }
    }

    public async getInitState(): Promise<InitData> {
        const patientPromise = this.getPatient()
        const practitioner = await this.getPractitioner()
        const hospital = practitioner.organizationReference !== undefined ? await this.getHospital(practitioner.organizationReference) : undefined;
        return {
            patient: await patientPromise,
            practitioner,
            hospital,
        }
    }

    public async ping(): Promise<boolean> {
        const resp = await this.client.request("metadata")
        return true
    }
}
