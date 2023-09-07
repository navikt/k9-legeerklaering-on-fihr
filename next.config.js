/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    env: {
        FHIR_API_URL: process.env.FHIR_API_URL,
        FHIR_CLIENT_ID: process.env.FHIR_CLIENT_ID,
        FHIR_SUBSCRIPTION_KEY: process.env.FHIR_SUBSCRIPTION_KEY,
    },
    experimental: {
        typedRoutes: true,
        serverActions: true,
    },
}

module.exports = nextConfig
