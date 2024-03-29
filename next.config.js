const nextTranslate = require('next-translate-plugin')
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    INDEXED_DB_NAME: process.env.INDEXED_DB_NAME,
    INDEXED_DB_STORE: process.env.INDEXED_DB_STORE,
    BTFS_URL: process.env.BTFS_URL,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
    NFT_COLLECTION_CONTRACT: process.env.NFT_COLLECTION_CONTRACT
  },
  webpack: config => {
    config.resolve.fallback = { fs: false }

    return config
  },
  ...nextTranslate()
}

module.exports = nextConfig
