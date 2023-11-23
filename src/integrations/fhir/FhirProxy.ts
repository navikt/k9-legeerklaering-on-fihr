import { getServerEnv } from "@/utils/env";

export class FhirProxy {
    constructor(
        private readonly fhirBaseUrl: string,
        private readonly fhirSubscriptionKey: string,
        private readonly fhirSubscriptionKeyHeaderName: string,
        private readonly proxyPrefixPath: string,
    ) {
    }

    static initDipsProxy(): FhirProxy {
        const {FHIR_BASE_URL, FHIR_SUBSCRIPTION_KEY} = getServerEnv()
        const proxyPrefixPath = "/api/fhir/proxy"
        return new FhirProxy(
            FHIR_BASE_URL,
            FHIR_SUBSCRIPTION_KEY,
            "dips-subscription-key",
            proxyPrefixPath,
        )
    }

    // Remove the proxy prefix path from the incoming request, so it's ready to be sent to actual fhir server
    rewriteIncomingPath(incomingPath: string): string {
        if(incomingPath.startsWith(this.proxyPrefixPath)) {
            return incomingPath.substring(this.proxyPrefixPath.length)
        } else {
            throw new Error(`incoming path "${incomingPath}" does not start with expected proxy prefix path "${this.proxyPrefixPath}"` )
        }
    }

    // Utility method to add a path to a base url, which may also contain a path.
    // The path is appended so that missing / is added, and // that would occur with naive concat is removed.
    urlPathAppend(base: string, path: string): string {
        let result = base;
        if(result.endsWith("/")) {
            result = result.substring(0, result.length - 1)
        }
        if(!path.startsWith("/")) {
            result += "/"
        }
        result += path
        return result
    }

    // Replace this servers hostname with actual fhir server, and strip the proxy path prefix.
    rewriteIncomingUrl(incomingUrl: URL): URL {
        const rewrittenPath = this.rewriteIncomingPath(incomingUrl.pathname)
        // Construct url for request to actual fhir server
        // Since the base url can consist of both host and path we reassemble it
        const rewrittenUrl = new URL(this.urlPathAppend(this.fhirBaseUrl, rewrittenPath))
        rewrittenUrl.search = incomingUrl.search
        rewrittenUrl.username = incomingUrl.username
        rewrittenUrl.password = incomingUrl.password
        return rewrittenUrl
    }

    // Make a copy of the incoming request, adjusting the url to match the actual fhir server we're proxying
    createForwardRequest(incomingReq: Request): Request {
        const newUrl = this.rewriteIncomingUrl(new URL(incomingReq.url))
        const newHeaders = new Headers(incomingReq.headers) // Make a copy so that we don't mutate incoming (while iterating it)
        // Strip out any x-forwarded-* headers, they caused server error in fhir server.
        for(const key of incomingReq.headers.keys()) {
            if(key.startsWith("x-forwarded-")) {
                newHeaders.delete(key)
            }
        }
        newHeaders.set("host", newUrl.host)
        newHeaders.set(this.fhirSubscriptionKeyHeaderName, this.fhirSubscriptionKey)
        return new Request(
            newUrl,
            {
                method: incomingReq.method,
                headers: newHeaders,
                body: incomingReq.body,
                duplex: "half",
                mode: incomingReq.mode,
                credentials: incomingReq.credentials,
                cache: incomingReq.cache,
                redirect: 'manual',
                referrer: incomingReq.referrer,
                referrerPolicy: incomingReq.referrerPolicy,
                integrity: incomingReq.integrity,
                keepalive: incomingReq.keepalive,
                signal: incomingReq.signal,
            }
        )
    }

    async forwardRequest(incomingRequest: Request): Promise<Response> {
        return await fetch(this.createForwardRequest(incomingRequest))
    }
}
