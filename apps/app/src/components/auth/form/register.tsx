import { urls } from "@repo/common";
import { Alert, Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import { VSpace } from "../../lib/vertical-space";
import { SocialOptions } from "./social-options";

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentConfirmationEmail, setSentConfirmationEmail] = useState(false);

  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    setRegistering(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${urls.signUp()}`
      }
    });

    if (error) {
      setError(error.message);
    } else if (!data.session) {
      setSentConfirmationEmail(true);
    }

    setRegistering(false);
  }

  const hasValidEmail = email.length > 0 && email.includes('@');
  const hasValidPassword = password.length >= 8;
  const passwordsMatch = password === password2;
  const isValid = hasValidEmail && hasValidPassword && passwordsMatch;

  let warning: string | null = null;

  if (email.length > 0 && !email.includes('@')) {
    warning = "Invalid email address";
  }

  if (password.length > 0 && password.length < 8) {
    warning = "Password must be at least 8 characters";
  }

  if (password.length >= 8 && password2.length >= 8 && password !== password2) {
    warning = "Passwords must match";
  }

  if (sentConfirmationEmail) {
    return (
      <Typography.Text>
        Thank you! Please check your emails for a confirmation link
      </Typography.Text>
    )
  }

  return (
    <Form layout="vertical" disabled={registering}>
      <VSpace>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          size="large"
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          size="large"
          onChange={e => setPassword(e.target.value)}
        />

        <Input
          placeholder="Repeat Password"
          type="password"
          value={password2}
          size="large"
          onChange={e => setPassword2(e.target.value)}
        />

        <Button
          type="primary"
          style={{ width: '100%' }}
          size="large"
          onClick={handleRegisterClick}
          disabled={!isValid}
        >
          Register
        </Button>

        {error && <Alert type="error" message={error} />}
        {warning && <Alert type="warning" message={warning} />}

        <div style={{ textAlign: 'center' }}>
          <Typography.Text>
            {"Already have an account? "}
            <Typography.Link onClick={() => navigate(urls.login())}>
              Sign in
            </Typography.Link>
          </Typography.Text>
        </div>

        <SocialOptions />
      </VSpace>
    </Form >
  );
}
