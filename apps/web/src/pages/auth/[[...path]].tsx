import { prebuildUIs } from "@/config/supertokens";
import { useEffect, useState } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

export default function Auth() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (canHandleRoute(prebuildUIs()) === false) {
      redirectToAuth({ redirectBack: false });
    } else {
      setLoaded(true);
    }
  }, []);

  if (loaded) {
    return getRoutingComponent(prebuildUIs());
  }

  return null;
}
