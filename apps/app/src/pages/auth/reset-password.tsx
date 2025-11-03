import React from "react";
import { AuthPageWrapper } from "../../components/auth/wrapper";
import { ResetPassword } from "../../components/auth/reset-password";

export const ResetPasswordPage: React.FC = () => {
  return (
    <AuthPageWrapper>
      <ResetPassword />
    </AuthPageWrapper>
  )
}
