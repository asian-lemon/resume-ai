/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig