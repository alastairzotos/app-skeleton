import { urls } from "@/utils/urls";
import { useRouter } from "next/router";
import React from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

export const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <SessionAuth onSessionExpired={() => router.push(urls.login())}>
      {children}
    </SessionAuth>
  );
}
