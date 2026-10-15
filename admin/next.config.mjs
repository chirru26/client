/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  devIndicators: {
    position: 'bottom-right',
  },
}

export default nextConfig
