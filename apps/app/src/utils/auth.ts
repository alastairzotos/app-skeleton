import { useAuthState } from "../state/auth";
import { supabase } from "../supabase";

export const handleLogout = async () => {
  await supabase.auth.signOut();
  useAuthState.getState().setAuth(null, null);
  useAuthState.getState().setProfile(null);
}

interface FwdResult {
  getFwd: () => string | null;
  getAndClearFwd: () => string | null;
  setFwd: (fwd: string) => void;
}

export const useForwardUrl = (): FwdResult => {
  const SESSION_KEY = 'bm-fwd';

  const getFwd = () => {
    return sessionStorage.getItem(SESSION_KEY);
  }

  const getAndClearFwd = () => {
    const fwd = sessionStorage.getItem(SESSION_KEY);

    if (fwd) {
      sessionStorage.removeItem(SESSION_KEY);
    }

    return fwd;
  }

  const setFwd = (newFwd?: string) => {
    if (newFwd) {
      sessionStorage.setItem(SESSION_KEY, newFwd);
    }
  }

  return { getFwd, getAndClearFwd, setFwd };
}

