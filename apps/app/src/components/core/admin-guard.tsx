import { urls } from "@repo/common";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../state/auth";

export const AdminGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { profile } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      navigate(urls.home());
    }
  }, [profile]);

  return (
    <>{children}</>
  );
}
