import { Button } from "antd";
import React from "react";
import { supabase } from "../../../supabase";
import { FacebookIcon, GoogleIcon } from "../../icons";

type OAuthProvider = 'google' | 'facebook';

const icons: Record<OAuthProvider, React.ReactNode> = {
  google: <GoogleIcon />,
  facebook: <FacebookIcon />,
}

interface Props {
  provider: OAuthProvider;
}

export const SocialLoginButton: React.FC<Props> = ({ provider }) => {
  const handleLoginClick = async () => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button
      color="blue"
      variant="filled"
      size="large"
      style={{ width: '100%', display: 'flex' }}
      onClick={handleLoginClick}
    >
      {icons[provider]}
      {provider[0].toLocaleUpperCase() + provider.substring(1)}
    </Button>
  )
}
