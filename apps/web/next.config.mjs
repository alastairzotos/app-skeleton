/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    // The following should be uncommented if using ant-design
    // 'antd',
    // '@ant-design/icons',
    // '@ant-design/icons-svg',
    // '@babel/runtime',
    // 'rc-util',
    // 'rc-pagination',
    // 'rc-picker',
    // 'rc-table',
    // 'rc-tree'
  ],
  publicRuntimeConfig: {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  }
};

export default nextConfig;
