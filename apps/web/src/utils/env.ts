import getConfig from "next/config";

export const getEnv = () => ({
  nodeEnv: getConfig().publicRuntimeConfig.NEXT_PUBLIC_NODE_ENV as 'development' | 'production',
  apiUrl: getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL as string,

  googleClientId: getConfig().publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
})
