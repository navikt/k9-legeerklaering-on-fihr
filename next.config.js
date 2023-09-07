/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        typedRoutes: true,
        serverActions: true,
    },
}

module.exports = nextConfig
