import getConfig from "next/config";

export const getEnv = () => ({
  nodeEnv: getConfig().publicRuntimeConfig.NEXT_PUBLIC_NODE_ENV as 'development' | 'production',
  appName: getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_NAME as string,
  apiUrl: getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL as string,
  clientUrl: getConfig().publicRuntimeConfig.NEXT_PUBLIC_CLIENT_URL as string,
})
