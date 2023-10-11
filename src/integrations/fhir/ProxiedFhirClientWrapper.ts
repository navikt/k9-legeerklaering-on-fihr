import Practitioner, { PartialPractitioner } from "@/models/Practitioner";
import { R4 } from "@ahryman40k/ts-fhir-types";
import { validateOrThrow } from "@/integrations/fhir/fhirValidator";
import {
    bundleResourceList,
    dateTimeResolver,
    iPractitionerRoleFromListing,
    officialHumanNameResolver,
    officialIdentifierResolver,
    organizationNumberFromIdentifiers,
    phoneContactResolver,
    postalAddressResolver,
    resolvePractitionerFromIPractitioner,
    resolvePractitionerFromIPractitionerRole
} from "@/integrations/fhir/resolvers";
import Patient from "@/models/Patient";
import Client from "fhirclient/lib/Client";
import { clientCopyWithProxyUrl } from "@/integrations/fhir/clientInit";
import { FhirApi } from "@/integrations/fhir/FhirApi";
import Hospital from "@/models/Hospital";
import IncompletePractitioner from "@/models/errors/IncompletePractitioner";
import InitData from "@/models/InitData";


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
            epjId: id,
            organizationNumber,
            name,
            phoneNumber,
            address,
        }
    }

    public async getPractitioner(): Promise<Practitioner & {readonly organizationReference: string | undefined}> {
        // For DIPS, accessing the client.user.read or similar did not work, have to request the "PractitionerBundle" like we do below instead.
        // This bundle seems to contain the Practitioner info we in the smart api demo would get back from client.user.read.
        // I suspect this is a non-standard API call. Will perhaps need to make this more dynamic to adapt to other EPJ systems.
        // E.g. perhaps first check if client.user.id is set, and try using the standard client.user.read call if so. If the standard
        // way is not available, go on to try this method. A potential problem with just using client.user.read, though, is that maybe
        // the info about what organization (hospital) the practitioner is working for might not be available then.
        const iPractitionerRoleBundle = validateOrThrow(R4.RTTI_Bundle.decode(await this.client.request<R4.IBundle>("PractitionerRole/$getCurrentUser")))
        const iPractitionerRole = iPractitionerRoleFromListing(bundleResourceList(iPractitionerRoleBundle))
        if (iPractitionerRole === undefined) {
            throw new Error("No PractitionerRole found in the $getCurrentUser bundle")
        }
        const practitionerFromRole = resolvePractitionerFromIPractitionerRole(iPractitionerRole)
        // If the practitioner info resolved from practitioner role is complete, return it
        if(
            practitionerFromRole.epjId !== undefined &&
            practitionerFromRole.hprNumber !== undefined &&
            practitionerFromRole.name !== undefined
        ) {
            return {
                epjId: practitionerFromRole.epjId,
                hprNumber: practitionerFromRole.hprNumber,
                name: practitionerFromRole.name,
                activeSystemUser: practitionerFromRole.activeSystemUser === undefined ? true: practitionerFromRole.activeSystemUser,
                organizationReference: iPractitionerRole.organization?.reference
            }
        }
        // Practitioner role did not have complete info, try getting it from Practitioner endpoint
        if(iPractitionerRole?.practitioner?.reference === undefined) {
            throw new Error(`No practitioner reference in PractitionerRole from $getCurrentUser`)
        }
        const iPractitioner = validateOrThrow(R4.RTTI_Practitioner.decode(await this.client.request(iPractitionerRole.practitioner.reference)))
        const practitioner = resolvePractitionerFromIPractitioner(iPractitioner)
        const mergedPractitioner: PartialPractitioner = {
            ...practitionerFromRole,
            ...practitioner,
        }
        if(
            mergedPractitioner.epjId !== undefined &&
            mergedPractitioner.hprNumber !== undefined &&
            mergedPractitioner.name !== undefined
        ) {
            return {
                epjId: mergedPractitioner.epjId,
                hprNumber: mergedPractitioner.hprNumber,
                name: mergedPractitioner.name,
                activeSystemUser: mergedPractitioner.activeSystemUser,
                organizationReference: iPractitionerRole.organization?.reference
            }
        } else {
            throw new IncompletePractitioner(mergedPractitioner)
        }
    }

    public async getPatient(): Promise<Patient> {
        const patient = validateOrThrow(R4.RTTI_Patient.decode(await this.client.patient.read()));
        const name = officialHumanNameResolver(patient.name)
        const identifier = officialIdentifierResolver(patient.identifier);
        const birthDate = dateTimeResolver(patient.birthDate)

        if (identifier !== undefined && name !== undefined) {
            return {
                name,
                identifier,
                birthDate,
            }
        } else {
            throw new Error(`Patient returned from EHR system missing identifier and/or name (name: ${name})`);
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
        console.debug("metadata reply ok")
        return true
    }
}