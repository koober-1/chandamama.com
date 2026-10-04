import path from 'path'
import fs from 'fs'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    unoptimized: true
  },

  transpilePackages: ['firebase', '@firebase/auth', '@firebase/app', '@firebase/component', '@firebase/util'],

  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['react-icons', 'lucide-react', 'lodash', 'date-fns'],
  },

  async rewrites() {
    return [
      {
        source: '/customer/:path*',
        destination: `${backendUrl}/customer/:path*`,
      },
      {
        source: '/storage/:path*',
        destination: `${backendUrl}/storage/:path*`,
      },
    ];
  },

  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    if (dir && outDir && fs.existsSync(path.join(dir, '.htaccess'))) {
      fs.copyFileSync(path.join(dir, '.htaccess'), path.join(outDir, '.htaccess'))
    }
    return defaultPathMap
  }
};

if (process.env.NEXT_PUBLIC_SEO === "true") {
  nextConfig.output = "standalone";
} else if (process.env.NODE_ENV === "production") {
  nextConfig.output = "export";
}

export default nextConfig;
