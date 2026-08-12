import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: [
    '@eggeo/db',
    '@eggeo/validation',
    '@eggeo/types',
    '@eggeo/domain',
    '@eggeo/ui',
    '@gluestack-ui/themed',
    '@gluestack-ui/button',
    '@gluestack-ui/form-control',
    '@gluestack-ui/input',
    '@gluestack-ui/provider',
    '@gluestack-ui/utils',
    '@gluestack-style/react',
    'react-native',
    'react-native-web',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'react-native$': 'react-native-web',
      'react-native-svg$': new URL('./shims/react-native-svg.tsx', import.meta.url).pathname,
    };
    return config;
  },
};

export default nextConfig;
