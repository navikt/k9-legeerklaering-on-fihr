import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface DipsProfile extends Record<string, any> {
    aud: string
    azp: string
    email: string
    email_verified: boolean
    exp: number
    family_name: string
    given_name: string
    hd: string
    iat: number
    iss: string
    jti: string
    name: string
    nbf: number
    picture: string
    sub: string
}

export default function Dips<P extends DipsProfile>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
    return {
        id: "dips",
        name: "DIPS",
        type: "oauth",
        wellKnown: "https://api.dips.no/fhir/.well-known/smart-configuration",
        authorization: {
            params: {
                scope: "openid dips-fhir-r4 fhirUser patient/*.read offline_access"
            }
        },
        idToken: true,
        checks: ["pkce", "state"],
        profile(profile) {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            }
        },
        style: {
            logo: "public/dips.png",
            logoDark: "/dips.png",
            bgDark: "#00149e",
            bg: "#00149e",
            text: "#fff",
            textDark: "#fff",
        },
        options
    }
}
