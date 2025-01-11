import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  devIndicators: {
    appIsrStatus: false,
  },
  // Ensure middleware is loaded from src directory
  middleware: {
    path: 'src/middleware.ts',
  }

};
export default nextConfig;


/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
};