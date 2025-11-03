import { Divider } from "antd";
import React from "react";
import { VSpace } from "../../lib/vertical-space";
import { SocialLoginButton } from "./social-button";

export const SocialOptions: React.FC = () => {
  return (
    <>
      <Divider>Or sign in with</Divider>

      <VSpace>
        <SocialLoginButton provider="google" />
        {/* <SocialLoginButton provider="facebook" /> */}
      </VSpace>
    </>
  )
}
