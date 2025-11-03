import { urls } from "@repo/common";
import { useEffect } from "react";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { RootLayout } from "./layouts/root-layout";
import { AccountPage } from "./pages/account";
import { AuthCallbackPage } from "./pages/auth/callback";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { ResetPasswordPage } from "./pages/auth/reset-password";
import { SignUpPage } from "./pages/auth/sign-up";
import { BillingPage } from "./pages/billing";
import { NoMatchPage } from "./pages/no-match";
import { getEnv } from "./utils/env";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Navigate to={urls.home()} />} />

      <Route path="auth/login" element={<LoginPage />} />
      <Route path="auth/register" element={<RegisterPage />} />
      <Route path="auth/callback" element={<AuthCallbackPage />} />
      <Route path="auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="auth/sign-up" element={<SignUpPage />} />

      <Route path="account" element={<AccountPage />} />
      <Route path="billing" element={<BillingPage />} />

      <Route path="*" element={<NoMatchPage />} />
    </Route>
  )
)

function App() {
  useEffect(() => {
    const { appName } = getEnv();

    document.title = appName;
  }, []);

  return (
    <RouterProvider router={router} />
  )
}

export default App
