
import { urls } from "@/utils/urls";
import { usePersona } from "@bitmetro/persona-react";
import { User } from "@repo/models";
import Link from "next/link";

export default function Home() {
  const { logout, loggedInUser } = usePersona<User>();

  console.log({ loggedInUser });

  return (
    <div>
      <p>Hello {loggedInUser?.name || 'Stranger'}</p>

      <Link href={urls.login()}>Login</Link><br />
      <Link href={urls.register()}>Register</Link><br />
      <Link href={urls.authTest()}>Auth Test</Link><br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}
