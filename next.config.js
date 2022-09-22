/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'www.arweave.net',
      'arweave.net',
      'nftstorage.link',
      'www.nftstorage.link'
    ]
  }
}

module.exports = nextConfig
