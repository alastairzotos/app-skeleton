import * as Sentry from "@sentry/react";
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { getEnv } from "./utils/env.ts";

if (getEnv().nodeEnv === 'production') {
  Sentry.init({
    dsn: getEnv().sentryDsn,
    sendDefaultPii: true
  });
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
)
