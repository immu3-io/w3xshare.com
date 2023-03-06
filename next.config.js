/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    POLLINATIONX_URL: process.env.POLLINATIONX_URL,
    POLLINATIONX_TOKEN: process.env.POLLINATIONX_TOKEN,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID
  },
  future: {
    webpack5: true
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    }

    return config
  }
}

module.exports = nextConfig
