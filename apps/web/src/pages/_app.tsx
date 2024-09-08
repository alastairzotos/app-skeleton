import React from 'react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { supertokensConfig } from '@/config/supertokens';

if (typeof window !== 'undefined') {
  SuperTokens.init(supertokensConfig());
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SuperTokensWrapper>
      <Component {...pageProps} />
    </SuperTokensWrapper>
  );
}
