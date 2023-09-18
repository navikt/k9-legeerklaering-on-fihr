import { NextRequest, NextResponse } from 'next/server';
import { NextURL } from 'next/dist/server/web/next-url';

export const FHIR_AUTHORIZATION_TOKEN = "fhir-authorization-token";

export const middleware = (request: NextRequest): NextResponse => {
    logRequest(request);

    const authorization = request.headers.get(FHIR_AUTHORIZATION_TOKEN);
    if (!authorization) {
        const unauthorizedResponse = new NextResponse(
            JSON.stringify({
                message: 'authentication failed'
            }),
            {
                status: 401,
                statusText: 'Unauthorized',
            }
        );
        logResponse(request.nextUrl, unauthorizedResponse);
        return unauthorizedResponse
    }
    // TODO: Validere token issuer?
    const response = NextResponse.next();
    logResponse(request.nextUrl, response);
    return response
};

const maskedPathname = (nextUrl: NextURL): string => {
    // Replace the IDs in the pathname for Patient and Practitioner;
    return nextUrl.pathname.replace(/(\/api\/fhir\/(Patient|Practitioner)\/)[^/]+/, '$1<masked>');
};

const logRequest = (request: NextRequest) => {
    const {method, nextUrl} = request
    console.log(`--> Request ${method} ${maskedPathname(nextUrl)}`)
};

const logResponse = (nextUrl: NextURL, response: NextResponse) => {
    const {status, statusText} = response
    console.log(`<-- Response ${status} ${statusText} ${maskedPathname(nextUrl)}`)
};

export const config = {
    matcher: ["/api/fhir/:path*"]
}
