import React from "react";
import axios from 'axios';
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/lib/button";
import { getEnv } from "@/utils/env";

// const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${getEnv().googleClientId}&redirect_uri=${getEnv().apiUrl}/api/v1/auth/google-redirect&response_type=code&scope=openid%20email%20profile&access_type=offline`;

export const GoogleLogin: React.FC = () => {
  const login = () => {
    window.open(`${getEnv().apiUrl}/api/v1/auth/google`, '_self');
  }

  // console.log(googleLoginUrl)

  return (
    <Button onClick={login}>
      Login with Google
    </Button>
  )
}
