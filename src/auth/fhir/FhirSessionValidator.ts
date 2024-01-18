import * as jose from 'jose';
import { FhirAuthError } from "@/auth/fhir/FhirAuthError";

// A simple marker type for a JWT issuer to avoid mixup
export type Issuer = `https://${string}.${string}`;

// Some basic validation
const isIssuer = (str?: string): str is Issuer =>
    str !== undefined &&
    str.startsWith("https://") &&   // all issuer urls must start with https://
    str.indexOf(".") > 8 &&         // must be a dot somewhere in a valid domain
    !str.endsWith("/")              // must not end with a slash

export class FhirSessionValidator {

    private static extractBearerTokenFrom(authorizationHeader: string | null): string {
        if(authorizationHeader !== null) {
            if(authorizationHeader.startsWith("Bearer ")) {
                // Strip the "Bearer " prefix and return the rest
                return authorizationHeader.substring(7)
            } else {
                throw new FhirAuthError(`authorization header value did not start with "Bearer"`)
            }
        } else {
            throw new FhirAuthError(`no authorization header value found`)
        }
    }

    // XXX Should probably change this to be a server configuration value later.
    static readonly validIssuers: Issuer[] = [
        'https://api.dips.no/dips.oauth' // opendips sandbox for dev/testing
    ]

    // Parses the incoming JWT without validation to get the claimed issuer.
    // This is then used to map to an url where we can fetch the JWKS for validation of the JWT.
    private static initialIssuerDecode(authorizationHeader: string): Issuer {
        const claims = jose.decodeJwt(authorizationHeader)
        if(isIssuer(claims.iss) && this.validIssuers.includes(claims.iss)) {
            return claims.iss
        } else {
            throw new FhirAuthError(`${claims.iss} is not a valid issuer.`)
        }
    }


    private static jwksUrl(issuer: Issuer): URL {
        return new URL(`${issuer}/.well-known/openid-configuration/jwks`)
    }

    static async verifyJWT(authorizationHeader: string) {
        const token = this.extractBearerTokenFrom(authorizationHeader)
        const issuer = this.initialIssuerDecode(token)
        // XXX Should this be cached somehow, to avoid hitting the jwks url every request? (Or is it done automagically in lib?)
        const jwks = jose.createRemoteJWKSet(this.jwksUrl(issuer))
        const options = {
            issuer: this.validIssuers
        }
        const { payload, protectedHeader } = await jose.jwtVerify(token, jwks, options)
    }
}
