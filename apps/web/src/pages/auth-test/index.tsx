import { NextPage } from "next";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

const AuthTestPage: NextPage = () => {
  return (
    <SessionAuth>
      <p>Authenticated</p>
    </SessionAuth>
  )
}

export default AuthTestPage;
