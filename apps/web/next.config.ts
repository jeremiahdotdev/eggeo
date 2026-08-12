import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: [
    '@eggeo/db',
    '@eggeo/validation',
    '@eggeo/types',
    '@eggeo/domain',
    '@eggeo/ui',
    'react-native',
    'react-native-web',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@prisma/client$': new URL('../../packages/db/node_modules/@prisma/client/default.js', import.meta.url).pathname,
      'react-native$': 'react-native-web',
      'react-native-svg$': new URL('./shims/react-native-svg.tsx', import.meta.url).pathname,
    };
    return config;
  },
};

export default nextConfig;
