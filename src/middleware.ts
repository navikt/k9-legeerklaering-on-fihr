// This function can be marked `async` if using `await` inside
import { NextRequest, NextResponse } from 'next/server';

export const FHIR_AUTHORIZATION_TOKEN = "fhir-authorization-token";
export const middleware = (request: NextRequest): NextResponse => {
    const authorization = request.headers.get(FHIR_AUTHORIZATION_TOKEN);
    if (!authorization) {
        return new NextResponse(
            JSON.stringify({
                message: 'authentication failed'
            }),
            {
                status: 401,
                statusText: 'Unauthorized',
            }
        )
    }
    // TODO: Validere token issuer?
    return NextResponse.next()
};

export const config = {
    matcher: ["/api/:path*"]
}
