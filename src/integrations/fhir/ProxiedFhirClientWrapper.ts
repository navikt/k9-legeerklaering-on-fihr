import Client from "fhirclient/lib/Client";
import FhirClientWrapper from "@/integrations/fhir/FhirClientWrapper";


/**
 * Dips sandbox server requires a special api key, so all requests after authentication go through our own proxy server that adds this.
 */
export default class ProxiedFhirClientWrapper extends FhirClientWrapper {
    public constructor(client: Client) {
        // Create a new client that sends all requests through our server proxy
        const proxyUrl = new URL("/api/fhir/proxy/", new URL(window.location.origin));
        const proxyingClient = clientCopyWithProxyUrl(client, proxyUrl)
        // Create the FhirClientWrapper with the proxied client
        super(proxyingClient)
    }
}

const clientCopyWithProxyUrl = (client: Client, proxyUrl: URL): Client =>  {
    const newClientState = {
        ...client.state,
        serverUrl: proxyUrl.toString(),
    }
    return new Client(client.environment, newClientState)
}
