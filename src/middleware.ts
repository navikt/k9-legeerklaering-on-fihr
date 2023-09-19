import { NextRequest, NextResponse } from 'next/server';
import { logRequest, logResponse } from '@/utils/loggerUtils';

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

export const config = {
    matcher: ["/api/fhir/:path*"]
}
