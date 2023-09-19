import { NextRequest, NextResponse } from 'next/server';
import { logResponse } from '@/utils/loggerUtils';


export const FHIR_AUTHORIZATION_TOKEN = "fhir-authorization-token";

export const middleware = (request: NextRequest): NextResponse => {
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
    return NextResponse.next()
};

export const config = {
    matcher: ["/api/fhir/:path*"]
}
