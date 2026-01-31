/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/skir-website',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
