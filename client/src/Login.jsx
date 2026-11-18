import { useState } from "react";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <button onClick={() => setLoggedIn(true)}>Login</button>
      {loggedIn && <p>Welcome back</p>}
    </div>
  );
}