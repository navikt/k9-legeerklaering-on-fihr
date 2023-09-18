// This function can be marked `async` if using `await` inside
import { NextRequest, NextResponse } from 'next/server';

export const FHIR_AUTHORIZATION_TOKEN = "fhir-authorization-token";
export const middleware = (request: NextRequest): NextResponse => {
    const {method, nextUrl} = request
    // Replace the IDs in the pathname for Patient and Practitioner
    const maskedPathname = nextUrl.pathname.replace(/(\/api\/fhir\/(Patient|Practitioner)\/)[^/]+/, '$1<masked>');
    console.log(`Request ${method} ${maskedPathname}`)

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
        console.log(`Response ${unauthorizedResponse.status} ${unauthorizedResponse.statusText} ${maskedPathname}`)
        return unauthorizedResponse
    }
    // TODO: Validere token issuer?
    const response = NextResponse.next();
    const {status, statusText} = response
    console.log(`Response ${status} ${statusText} ${maskedPathname}`)
    return response
};

export const config = {
    matcher: ["/api/fhir/:path*"]
}
