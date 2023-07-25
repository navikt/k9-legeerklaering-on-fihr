import {oauth2} from 'fhirclient';
import ClientWrapper from "@/integrations/fhir/ClientWrapper";
import {fhirclient} from "fhirclient/lib/types";
import AuthorizeParams = fhirclient.AuthorizeParams;

/**
 * Authparams that should work in the "EHR launch" setting which we expect to operate.
 *
 * All other params are then expected to come in via request url query arguments from the EHR browser launch, and we expect
 * that the auth flow should be displayed in the same browser window, so we don't set the target option, and therefore don't
 * need to set the completeInTarget option or any of the width or height options either.
 */
const authParams: AuthorizeParams = {
    clientId: "NAV legeerklæring",
    redirectUri: "/",
    scope: "patient/*.read user/*.read openid fhirUser profile", // Not sure exactly what we need here yet.
}

/**
 * Initializes the smart client. If the URL is a "launch url" coming from the EHR system, that is used, and the resulting
 * authentication token is stored in local browser storage. As part of the initial auth process, this will do a redirect
 * roundtrip to the smart server. When it is not a launch URL, it looks for and uses the auth token stored in browser local
 * storage. If the auth token is not found in local storage, or is expired it will give a "not authorized" error. The
 * user must then reauthenticate by opening the window again from the EHR system to get a new launch url.
 *
 * @param reAuth set to true when launching a new context in a existing window/tab, to force a re-authentication
 */
export const clientInitInBrowser = async (reAuth: boolean): Promise<ClientWrapper> => {
    if (reAuth) {
        sessionStorage.clear();
    }
    const client = await oauth2.init(authParams)
    return new ClientWrapper(client)
}

// XXX Wanted to create a initOnServer function here, and possibly do some server side rendering. Turned out to be a
// bit difficult. (must create adapter with solution for sharing state storage between server and client(?))
// export const clientInitOnServer = async (req): Promise<ClientWrapper> => {
// }
