import { Protected } from "@/components/lib/protected";
import { NextPage } from "next";

const AuthTestPage: NextPage = () => {
  return (
    <Protected>
      <p>Authenticated</p>
    </Protected>
  )
}

export default AuthTestPage;
