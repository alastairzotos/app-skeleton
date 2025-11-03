import React from "react";
import { AuthPageWrapper } from "../../components/auth/wrapper";
import { LoginForm } from "../../components/auth/form/login";

export const LoginPage: React.FC = () => {
  return (
    <AuthPageWrapper>
      <LoginForm />
    </AuthPageWrapper>
  )
}
