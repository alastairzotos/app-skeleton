import React from "react";
import { RegisterForm } from "../../components/auth/form/register";
import { AuthPageWrapper } from "../../components/auth/wrapper";

export const RegisterPage: React.FC = () => {
  return (
    <AuthPageWrapper>
      <RegisterForm />
    </AuthPageWrapper>
  )
}
