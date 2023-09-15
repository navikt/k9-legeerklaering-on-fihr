import { headers } from 'next/headers';

export interface FhirConfiguration {
    fhirbaseurl: string;
    fhirsubscriptionkey: string;
    authorization: string;
}

export const fhirConfiguration = (): FhirConfiguration => {
    const headersList = headers()

    const fhirbaseurl = process.env.FHIR_BASE_URL;
    if (!fhirbaseurl) {
        throw new Error('FHIR_BASE_URL is not defined.');
    }

    const fhirsubscriptionkey = process.env.FHIR_SUBSCRIPTION_KEY;
    if (!fhirsubscriptionkey) {
        throw new Error('FHIR_SUBSCRIPTION_KEY is not defined.');
    }

    const authorization = headersList.get("fhir-authorization-token");
    if (!authorization) {
        throw new Error('fhir-authorization-token header is not found.');
    }

    return {fhirbaseurl, fhirsubscriptionkey, authorization};
};
