import Client from "fhirclient/lib/Client";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";
import {
    dateTimeResolver,
    officialHumanNameResolver,
    officialIdentifierResolver,
    phoneContactResolver,
    postalAddressResolver
} from "@/integrations/fhir/resolvers";
import Hospital from "@/models/Hospital";
import { IPractitionerRole } from '@ahryman40k/ts-fhir-types/lib/R4';
import { validateOrThrow } from '@/integrations/fhir/fhirValidator';
import { R4 } from '@ahryman40k/ts-fhir-types';


/**
 * Wraps the imported FHIR client so that we can do our adaptions of what it provides, and provide our own argument
 * and return types to match our needs.
 */
export default class FhirService {
    private practitionerRole: Promise<IPractitionerRole>;

    public constructor(private client: Client) {
        this.practitionerRole = this.getPractitionerRole()
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

        return validateOrThrow(R4.RTTI_PractitionerRole.decode(await response.json()));
    }

    public async getDoctor(): Promise<Doctor> {
        const authorizationHeader: string | null = this.client.getAuthorizationHeader();

        const practitionerRole: IPractitionerRole = await this.practitionerRole;
        const practitionerReference = practitionerRole.practitioner?.reference;

        const baseUrl = new URL(window.location.origin);
        const practitionerUrl = new URL(`/api/fhir/${practitionerReference}`, baseUrl);

        const response = await fetch(practitionerUrl.toString(), {
            headers: {
                "fhir-authorization-token": authorizationHeader ?? ""
            }
        });

        const practitioner = validateOrThrow(R4.RTTI_Practitioner.decode(await response.json()));
        const name = officialHumanNameResolver(practitioner.name)
        if (practitioner.id !== undefined && name !== undefined) {
            return {
                hpr: practitioner.id, // This is probably wrong. Is probably a separate identifier for norwegian HPR number
                navn: name,
            };
        } else {
            throw new Error(`Practitioner returned from EHR system missing id and/or name (${practitioner.id} - ${name})`)
        }
    }

    public async getPatient(): Promise<Patient> {
        const patientId = this.client.patient.id;
        const authorizationHeader: string | null = this.client.getAuthorizationHeader();

        const baseUrl = new URL(window.location.origin);
        const patientUrl = new URL(`/api/fhir/Patient/${patientId}`, baseUrl);

        const response = await fetch(patientUrl.toString(), {
            headers: {
                "fhir-authorization-token": authorizationHeader ?? ""
            }
        });

        const patient = validateOrThrow(R4.RTTI_Patient.decode(await response.json()));
        const name = officialHumanNameResolver(patient.name)
        const identifier = officialIdentifierResolver(patient.identifier);
        const birthDate = dateTimeResolver(patient.birthDate)

        if (identifier !== undefined && name !== undefined) {
            return {
                navn: name,
                fnr: identifier,
                fødselsdato: birthDate,
            }
        } else {
            throw new Error(`Patient returned from EHR system missing identifier and/or name (name: ${name})`);
        }
    }

    public async getHospital(): Promise<Hospital> {
        const authorizationHeader: string | null = this.client.getAuthorizationHeader();

        const practitionerRole = await this.practitionerRole;
        if (!practitionerRole.organization?.reference) {
            throw new Error("Organization reference is not available");
        }

        const organizationRefrence = practitionerRole.organization?.reference;

        const baseUrl = new URL(window.location.origin);
        const organizationUrl = new URL(`/api/fhir/${organizationRefrence}`, baseUrl);

        const response = await fetch(organizationUrl.toString(), {
            headers: {
                "fhir-authorization-token": authorizationHeader ?? ""
            }
        });

        const organization = validateOrThrow(R4.RTTI_Organization.decode(await response.json()));
        const {name, telecom, address} = organization;

        return {
            navn: name,
            tlf: phoneContactResolver(telecom),
            adresse: postalAddressResolver(address),
        };
    }
}
