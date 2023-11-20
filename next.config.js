/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        FHIR_CLIENT_ID: process.env.FHIR_CLIENT_ID,
        FHIR_BASE_URL: process.env.FHIR_BASE_URL,
        FHIR_SUBSCRIPTION_KEY: process.env.FHIR_SUBSCRIPTION_KEY,
        AZURE_APP_CLIENT_ID: process.env.AZURE_APP_CLIENT_ID,
        AZURE_APP_CLIENT_SECRET: process.env.AZURE_APP_CLIENT_SECRET,
        AZURE_APP_WELL_KNOWN_URL: process.env.AZURE_APP_WELL_KNOWN_URL,
        HELSEOPPLYSNINGER_SERVER_BASE_URL: process.env.HELSEOPPLYSNINGER_SERVER_BASE_URL,
        HELSEOPPLYSNINGER_SERVER_SCOPE: process.env.HELSEOPPLYSNINGER_SERVER_SCOPE,
        SYNTHETIC_IDENTIFIER_ALLOWED: process.env.SYNTHETIC_IDENTIFIER_ALLOWED
    },
    experimental: {
        typedRoutes: true,
        serverActions: true,
        instrumentationHook: true
    },
}

module.exports = nextConfig
