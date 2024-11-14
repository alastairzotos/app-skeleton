import React, { useEffect } from "react";
import { usePersona } from '@bitmetro/persona-react';
import { useRouter } from "next/router";
import { urls } from "@/utils/urls";

export const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const { initialised, loggedInUser } = usePersona();

  useEffect(() => {
    if (initialised && !loggedInUser && router.pathname !== urls.login()) {
      router.push(urls.login());
    }
  }, [initialised, loggedInUser, router.pathname]);
  
  if (!initialised || !loggedInUser) {
    return null;
  }

  return (
    <>
      {children}
    </>
  )
}
