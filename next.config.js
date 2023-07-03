/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    serverRuntimeConfig: {
        fhirClientIssuer: process.env.FHIR_CLIENT_ISSUER,
        fhirClientScope: process.env.FHIR_CLIENT_SCOPE,
        fhirClientId: process.env.FHIR_CLIENT_ID
    }
}

module.exports = nextConfig
