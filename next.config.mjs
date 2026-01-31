/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Only use basePath for GitHub Pages subdirectory (not for custom domains)
  basePath: process.env.GITHUB_PAGES ? '/skir-website' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
