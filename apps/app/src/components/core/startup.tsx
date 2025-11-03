import { urls } from "@repo/common";
import * as Sentry from "@sentry/react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrCreateProfileRequest } from "../../requests/profiles";
import { useAuthState } from "../../state/auth";
import { supabase } from "../../supabase";
import { useForwardUrl } from "../../utils/auth";
import { getEnv } from "../../utils/env";
import { getSubscriptionInfoFromProfile } from "../../utils/profile";
import { ScreenLoader } from "../lib/screen-loader";

const trackSessionInTools = (session: Session) => {
  if (getEnv().nodeEnv === 'production') {
    Sentry.setUser({ id: session.user.id, email: session.user.email });
  }
}

export const Startup: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { getAndClearFwd, setFwd } = useForwardUrl();
  const { profile, accessToken, setProfile, setAuth } = useAuthState();

  const [initialised, setInitialised] = useState(false);

  const determineNextPageAfterSignIn = useCallback(async () => {
    return getAndClearFwd() || urls.home();
  }, []);

  const handleSessionChange = useCallback(async (session: Session | null, event?: AuthChangeEvent) => {
    setAuth(session?.user ?? null, session?.access_token ?? null);

    if (session && event === 'SIGNED_IN') {
      trackSessionInTools(session);

      const receivedProfile = await getOrCreateProfileRequest();
      setProfile(receivedProfile);

      if (pathname.startsWith('/auth/sign-up') || pathname.startsWith('/auth/callback')) {
        navigate(await determineNextPageAfterSignIn());
      }
    }

    setInitialised(true);
  }, [pathname]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      handleSessionChange(session, event);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (initialised && !accessToken && !pathname.startsWith('/auth')) {
      Sentry.setUser(null);
      setFwd(pathname);
      navigate(urls.login(), { replace: true });
    }
  }, [initialised, pathname, accessToken]);

  useEffect(() => {
    if (getSubscriptionInfoFromProfile(profile)?.trialEnded) {
      navigate(urls.billing());
    }
  }, [profile, pathname]);

  if (!initialised) {
    return <ScreenLoader />;
  }

  return <>{children}</>;
}