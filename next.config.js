/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// const nextConfig = {
//   // output: "export",
//   // basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
//   // assetPrefix: process.env.URL ? process.env.URL : undefined,
// };

const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  }
}

module.exports = nextConfig
