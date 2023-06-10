import type { NextConfig } from 'next'

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
}

export default withVanillaExtract(nextConfig)
