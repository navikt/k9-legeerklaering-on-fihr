import Client from "fhirclient/lib/Client";
import Doctor from "@/models/Doctor";
import { R4 } from '@ahryman40k/ts-fhir-types';
import { Validation } from "io-ts";
import { PathReporter } from "io-ts/es6/PathReporter";
import Patient from "@/models/Patient";
import {
    dateTimeResolver,
    officialHumanNameResolver,
    officialIdentifierResolver,
    phoneContactResolver,
    postalAddressResolver
} from "@/integrations/fhir/resolvers";
import Hospital from "@/models/Hospital";
import { fhirclient } from 'fhirclient/lib/types';
import { IOrganization, IPractitionerRole } from '@ahryman40k/ts-fhir-types/lib/R4';
import { fhirSubscriptionKey } from '@/utils/environment';
import Bundle = fhirclient.FHIR.Bundle;


/**
 * Wraps the imported FHIR client so that we can do our adaptions of what it provides, and provide our own argument
 * and return types to match our needs.
 */
export default class FhirService {
    private practitionerRole: Promise<IPractitionerRole>;

    public constructor(private client: Client) {
        this.practitionerRole = this.getPractitionerRole()
    }

    private static validateOrThrow<T>(validation: Validation<T>): T {
        if (validation._tag === "Right") {
            return validation.right
        } else {
            throw new Error(`FHIR data validation error: ${PathReporter.report(validation).join("\n")}`);
        }
    }

    private async getPractitionerRole(): Promise<IPractitionerRole> {
        const authorizationHeader: string | null = this.client.getAuthorizationHeader();

        const baseUrl = new URL(window.location.origin);
        const currentUserUrl = new URL(`/api/fhir/PractitionerRole/getCurrentUser`, baseUrl);

        const response = await fetch(currentUserUrl.toString(), {
            headers: {
                "fhir-authorization-token": authorizationHeader ?? ""
            }
        });

        const bundle = await response.json() as Bundle;

        if (!bundle.entry || bundle.entry.length === 0) {
            throw new Error("No entries found in the bundle.");
        }

        const practitionerRole = FhirService.validateOrThrow(R4.RTTI_PractitionerRole.decode(bundle.entry[0].resource as IPractitionerRole));

        if (!practitionerRole) {
            throw new Error("Unable to decode the current user.");
        }

        return practitionerRole as IPractitionerRole;
    }

    public async getDoctor(): Promise<Doctor> {
        const practitionerRole: IPractitionerRole = await this.practitionerRole;
        const practitionerReference = practitionerRole.practitioner?.reference;

        const user = await this.client.request<fhirclient.CombinedFetchResult<fhirclient.FHIR.Patient | fhirclient.FHIR.Practitioner | fhirclient.FHIR.RelatedPerson> | fhirclient.FHIR.Patient | fhirclient.FHIR.Practitioner | fhirclient.FHIR.RelatedPerson>({
            url: `/${practitionerReference}`,
            headers: {
                "dips-subscription-key": await fhirSubscriptionKey(),
            }
        });
        const practitioner = FhirService.validateOrThrow(R4.RTTI_Practitioner.decode(user));
        const name = officialHumanNameResolver(practitioner.name)
        if (practitioner.id !== undefined && name !== undefined) {
            return {
                hprNumber: practitioner.id, // This is probably wrong. Is probably a separate identifier for norwegian HPR number
                name,
            };
        } else {
            throw new Error(`Practitioner returned from EHR system missing id and/or name (${practitioner.id} - ${name})`)
        }
    }

    public async getPatient(): Promise<Patient> {
        const p = await this.client.patient.read({
            headers: {
                "dips-subscription-key": await fhirSubscriptionKey(),
            }
        });
        const patient = FhirService.validateOrThrow(R4.RTTI_Patient.decode(p));
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

    public async getHospital(): Promise<Hospital> {
        const practitionerRole = await this.practitionerRole;

        if (!practitionerRole.organization?.reference) {
            throw new Error("Organization reference is not available");
        }

        const organizationRefrence = practitionerRole.organization.reference;

        const orgResponse = await this.client.request<IOrganization>({
            url: organizationRefrence,
            headers: {
                "dips-subscription-key": await fhirSubscriptionKey(),
            }
        });

        const organization = FhirService.validateOrThrow(R4.RTTI_Organization.decode(orgResponse));

        const {name, telecom, address} = organization;

        return {
            name,
            phoneNumber: phoneContactResolver(telecom),
            address: postalAddressResolver(address),
        };
    }
}
