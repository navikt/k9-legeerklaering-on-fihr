import { NextRequest } from "next/server";
import { logger } from "@navikt/next-logger";
import { FhirProxy } from "@/integrations/fhir/FhirProxy";

const proxyHandler = async (request: NextRequest): Promise<Response> => {
    const proxy = FhirProxy.initDipsProxy();
    const resp = await proxy.forwardRequest(request)
    logger.info(`fhir proxyed request ${resp.url}, got a ${resp.status} response.`)
    return resp
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
export const HEAD = proxyHandler;
