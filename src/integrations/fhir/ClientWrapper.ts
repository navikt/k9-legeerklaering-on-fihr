import Client from "fhirclient/lib/Client";
import Doctor from "@/models/Doctor";
import {R4} from '@ahryman40k/ts-fhir-types';
import {Validation} from "io-ts";
import {PathReporter} from "io-ts/es6/PathReporter";
import Patient from "@/models/Patient";
import {
    dateTimeResolver,
    officialHumanNameResolver,
    officialIdentifierResolver,
    phoneContactResolver, postalAddressResolver
} from "@/integrations/fhir/resolvers";
import Hospital from "@/models/Hospital";


/**
 * Wraps the imported FHIR client so that we can do our adaptions of what it provides, and provide our own argument
 * and return types to match our needs.
 */
export default class ClientWrapper {
    public constructor(private client: Client) {
    }

    private static validateOrThrow<T>(validation: Validation<T>): T {
        if (validation._tag === "Right") {
            return validation.right
        } else {
            throw new Error(`FHIR data validation error: ${PathReporter.report(validation).join("\n")}`);
        }
    }

    public async getDoctor(): Promise<Doctor> {
        const user = await this.client.user.read();
        const practitioner = ClientWrapper.validateOrThrow(R4.RTTI_Practitioner.decode(user));
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
        const patient = ClientWrapper.validateOrThrow(R4.RTTI_Patient.decode(await this.client.patient.read()));
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
        const encounter = ClientWrapper.validateOrThrow(R4.RTTI_Encounter.decode(await this.client.encounter.read()));
        if (encounter.serviceProvider?.reference !== undefined) {
            const organization = ClientWrapper.validateOrThrow(R4.RTTI_Organization.decode(await this.client.request({
                url: encounter.serviceProvider?.reference,
            })));
            return {
                name: organization.name,
                phoneNumber: phoneContactResolver(organization.telecom),
                address: postalAddressResolver(organization.address),
            }
        } else {
            throw new Error(`encounter serviceProvider reference not defined, cannot resolve hospital information`)
        }
    }
}