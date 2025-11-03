export const getEnv = () => ({
  appName: import.meta.env.VITE_APP_NAME as string,
  nodeEnv: import.meta.env.VITE_NODE_ENV as 'development' | 'staging' | 'production',
  appVersion: import.meta.env.VITE_APP_VERSION as string || "0.0.0-dev",
  apiUrl: import.meta.env.VITE_API_URL as string,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN as string,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
})

export const apiEndpoint = getEnv().apiUrl + '/api/v1/';
