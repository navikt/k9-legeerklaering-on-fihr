import { NextRequest } from "next/server";
import { FhirProxy } from "@/integrations/fhir/FhirProxy";
import { logRequest, logResponse } from "@/utils/loggerUtils";

const proxyHandler = async (request: NextRequest): Promise<Response> => {
    logRequest(request)
    const proxy = FhirProxy.initDipsProxy();
    const resp = await proxy.forwardRequest(request)
    logResponse(request.nextUrl, resp)
    return resp
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const PATCH = proxyHandler;
export const DELETE = proxyHandler;
export const HEAD = proxyHandler;
