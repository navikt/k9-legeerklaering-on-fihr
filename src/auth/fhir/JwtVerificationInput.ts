import { JWTVerifyGetKey } from "jose";
import * as jose from "jose";
import { FhirAuthError } from "@/auth/fhir/FhirAuthError";
import { isIssuer, Issuer } from "@/auth/fhir/Issuer";
import { FhirSessionIssuers } from "@/auth/fhir/FhirSessionIssuers";

/**
 * This class exists to abstract away the input to FhirSession.fromVerifiedJWT, to facilitate unit testing of the
 * verification method. May also later be used if we need to support verification with pre-shared (offline) public keys.
 */
export class JwtVerificationInput {
    constructor(
        public readonly jwt: string,
        public readonly getKey: JWTVerifyGetKey,
    ) {}

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


    // Parses the incoming JWT without validation to get the claimed issuer.
    // This is then used to map to an url where we can fetch the JWKS for validation of the JWT.
    private static initialIssuerDecode(authorizationHeader: string): Issuer {
        const claims = jose.decodeJwt(authorizationHeader)
        if(isIssuer(claims.iss) && FhirSessionIssuers.all.includes(claims.iss)) {
            return claims.iss
        } else {
            throw new FhirAuthError(`${claims.iss} is not a valid issuer.`)
        }
    }

    /**
     * Derive the url to fetch the public key for verification of jwt from, based on the issuer URL.
     * This means we must trust the URL returned here to have the correct public key for verification of given issuer.
     * @param issuer
     * @private
     */
    private static jwksUrl(issuer: Issuer): URL {
        return new URL(`${issuer}/.well-known/openid-configuration/jwks`)
    }

    static fromAuthorizationHeader(authorizationHeader: string): JwtVerificationInput {
        const token = this.extractBearerTokenFrom(authorizationHeader)
        const issuer = this.initialIssuerDecode(token)
        // XXX Should this be cached somehow, to avoid hitting the jwks url every request? (Or is it done automagically in lib?)
        const jwks = jose.createRemoteJWKSet(this.jwksUrl(issuer))
        return new JwtVerificationInput(token, jwks)
    }
}

