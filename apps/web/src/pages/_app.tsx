import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getEnv } from "@/utils/env";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={getEnv().googleClientId}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
