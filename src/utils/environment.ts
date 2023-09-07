'use server'

import { fhirclient } from 'fhirclient/lib/types';
import AuthorizeParams = fhirclient.AuthorizeParams;

/**
 * Authparams that should work in the "EHR launch" setting which we expect to operate.
 *
 * All other params are then expected to come in via request url query arguments from the EHR browser launch, and we expect
 * that the auth flow should be displayed in the same browser window, so we don't set the target option, and therefore don't
 * need to set the completeInTarget option or any of the width or height options either.
 */
export const fhirClientAuthorizeParams = async (): Promise<AuthorizeParams> => {

    const issuer = process.env.FHIR_API_URL as string;
    if (!issuer) {
        throw new Error("Missing issuer in fhirClientConfig")
    }
    const clientId = process.env.FHIR_CLIENT_ID as string;
    if (!clientId) {
        throw new Error("Missing clientId in fhirClientConfig")
    }
    const scope = process.env.FHIR_CLIENT_SCOPE as string;
    if (!scope) {
        throw new Error("Missing scope in fhirClientConfig")
    }

    return {
        iss: clientId,
        clientId: clientId,
        redirectUri: "/",
        scope: scope,
    }
}

export const fhirSubscriptionKey = async (): Promise<string> => {
    const fhirsubscriptionkey = process.env.FHIR_SUBSCRIPTION_KEY;
    if (!fhirsubscriptionkey || fhirsubscriptionkey.trim() === "") {
        throw new Error("FHIR_SUBSCRIPTION_KEY is not defined or is empty")
    }
    return fhirsubscriptionkey
}
