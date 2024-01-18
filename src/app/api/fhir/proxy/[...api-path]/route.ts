import { NextRequest, NextResponse } from "next/server";
import { FhirProxy } from "@/integrations/fhir/FhirProxy";
import { logRequest, logResponse } from "@/utils/loggerUtils";
import { FhirSessionValidator } from "@/auth/fhir/FhirSessionValidator";
import { FhirAuthError } from "@/auth/fhir/FhirAuthError";

const authErrorResponse = (text: string): Response => {
    return new NextResponse(text, {status: 401});
}


const proxyHandler = async (request: NextRequest): Promise<Response> => {
    const authHeader = request.headers.get("Authorization")
    if(authHeader !== null) {
        try {
            // This verifies that incoming JWT is issued by a valid issuer.
            // TODO Consider adding more checks
            await FhirSessionValidator.verifyJWT(authHeader)
        } catch (verifErr) {
            if(verifErr instanceof FhirAuthError) {
                return authErrorResponse(verifErr.message)
            } else {
                throw verifErr
            }
        }
    } else {
        authErrorResponse(`No Authorization header value in request. Cannot validate session`)
    }
    const proxy = FhirProxy.initDipsProxy();
    return await proxy.forwardRequest(request)
}

const proxyHandlerWithRequestLogging = async (request: NextRequest): Promise<Response> => {
    logRequest(request)
    const resp = await proxyHandler(request)
    logResponse(request.nextUrl, resp)
    return resp
}

export const GET = proxyHandlerWithRequestLogging;
export const POST = proxyHandlerWithRequestLogging;
export const PUT = proxyHandlerWithRequestLogging;
export const PATCH = proxyHandlerWithRequestLogging;
export const DELETE = proxyHandlerWithRequestLogging;
export const HEAD = proxyHandlerWithRequestLogging;
