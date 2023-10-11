import { oauth2 } from 'fhirclient';

import { fhirClientId } from '@/utils/environment';
import Client from 'fhirclient/lib/Client';
import { FhirApi } from "@/integrations/fhir/FhirApi";
import FhirService from "@/integrations/fhir/FhirService";

/**
 * Initializes the smart client. If the URL is a "launch url" coming from the EHR system, that is used, and the resulting
 * authentication token is stored in local browser storage. As part of the initial auth process, this will do a redirect
 * roundtrip to the smart server. When it is not a launch URL, it looks for and uses the auth token stored in browser local
 * storage. If the auth token is not found in local storage, or is expired it will give a "not authorized" error. The
 * user must then reauthenticate by opening the window again from the EHR system to get a new launch url.
 *
 * @param reAuth set to true when launching a new context in a existing window/tab, to force a re-authentication
 * @param issuer
 * @param launch
 */
export const clientInitInBrowser = async (reAuth: boolean, issuer: string | undefined, launch: string | undefined): Promise<FhirApi> => {
    if (reAuth) {
        sessionStorage.clear();
    }

    const clientId: string = await fhirClientId();
    const client: Client = await oauth2.init({
        clientId: clientId,
        scope: "launch patient/*.read openid fhirUser profile",
        redirectUri: "/"
    });

    const clientInitIsComplete = client.patient.id !== null && client.state.tokenResponse?.access_token !== undefined;
    if(!clientInitIsComplete) {
        // TODO This should not happen according to how i interpret the client doc/code. Looks like some sort of race condition?
        console.warn(`client init not complete. patient id: ${client.patient.id}, token set? ${client.state.tokenResponse?.access_token !== undefined}`)

    }

    // return new ProxiedFhirClientWrapper(client)
    return new FhirService(client)
}

export const clientCopyWithProxyUrl = (client: Client, proxyUrl: URL): Client =>  {
    const newClientState = {
        ...client.state,
        serverUrl: proxyUrl.toString(),
    }
    return new Client(client.environment, newClientState)
}

// XXX Wanted to create a initOnServer function here, and possibly do some server side rendering. Turned out to be a
// bit difficult. (must create adapter with solution for sharing state storage between server and client(?))
// export const clientInitOnServer = async (authToken: string): Promise<FhirService> => {
// }
