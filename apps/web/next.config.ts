import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ['@eggeo/db', '@eggeo/validation', '@eggeo/types', '@eggeo/domain', '@eggeo/ui'],
};

export default nextConfig;
