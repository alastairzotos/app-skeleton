import React from 'react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PersonaProvider } from '@bitmetro/persona-react';
import { getEnv } from '@/utils/env';
import { useRouter } from 'next/router';
import { urls } from '@/utils/urls';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <PersonaProvider
      apiUrl={getEnv().apiUrl}
      onRegister={() => router.push(urls.register())}
      onLogin={() => router.push(urls.home())}
    >
      <Component {...pageProps} />
    </PersonaProvider>
  );
}
