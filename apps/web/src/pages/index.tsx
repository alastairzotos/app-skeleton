import { getEnv } from "@/utils/env";
import { urls } from "@/utils/urls";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { signOut, useSessionContext } from "supertokens-auth-react/recipe/session";

export default function Home() {
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const session = useSessionContext();

  console.log(!session.loading && session.accessTokenPayload)

  const getSecret = () => {
    fetch(`${getEnv().apiUrl}/api/v1/auth-test`).then(res => res.text()).then(console.log);
  }

  const onButtonClick = async () => {
    if (!session.loading && session.userId) {
      setSigningOut(true);
      await signOut();
      setSigningOut(false);

      router.push(urls.home());
    } else {
      router.push(urls.login());
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
      <p>hello</p>
      <button onClick={onButtonClick}>
        {
          signingOut
            ? 'Signing out...'
            : (
              !session.loading && session.doesSessionExist ? 'Sign out' : 'Sign in'
            )
        }
      </button>

      <button onClick={getSecret}>
        Fetch auth test
      </button>

      <Link href={urls.authTest()}>Auth test page</Link>
    </div>
  );
}
