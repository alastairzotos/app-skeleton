import { urls } from "@repo/common";
import { Alert, Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase";
import { VSpace } from "../../lib/vertical-space";
import { SocialOptions } from "./social-options";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const navigate = useNavigate();
  const handleLoginClick = async () => {
    setLoggingIn(true);

    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (user) {
      navigate(urls.authCallback());
    }

    setLoggingIn(false);
  }

  const handleResetPasswordClick = async () => {
    setSendingResetEmail(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${urls.resetPassword()}`,
    });

    if (error) {
      setError(error.message);
    }

    setSendingResetEmail(false);
    setResetEmailSent(true);
  }

  const hasValidEmail = email.trim().length > 0 && email.includes('@');
  const hasValidPassword = password.trim().length >= 8;
  const isValid = hasValidEmail && hasValidPassword;

  if (resetEmailSent) {
    return (
      <Typography.Text>
        Thank you! Please check your emails to reset your password
      </Typography.Text>
    );
  }

  return (
    <Form layout="vertical" disabled={loggingIn}>
      <Typography.Title level={3} style={{ marginTop: 8, marginBottom: 32 }}>
        Sign in
      </Typography.Title>
      
      <VSpace>
        {!forgotPassword && (
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

            <Button
              type="primary"
              style={{ width: '100%' }}
              size="large"
              onClick={handleLoginClick}
              disabled={!isValid}
            >
              Sign in
            </Button>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
              <Typography.Text>
                {"Don't have an account? "}
                <Typography.Link onClick={() => navigate(urls.register())}>
                  Sign up
                </Typography.Link>
              </Typography.Text>
              <Typography.Text>
                <Typography.Link onClick={() => setForgotPassword(true)}>
                  Forgot password?
                </Typography.Link>
              </Typography.Text>
            </div>
          </VSpace>
        )}

        {forgotPassword && (
          <VSpace>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              size="large"
              onChange={e => setEmail(e.target.value)}
            />

            <Button
              type="primary"
              style={{ width: '100%' }}
              size="large"
              disabled={!hasValidEmail || sendingResetEmail}
              loading={sendingResetEmail}
              onClick={handleResetPasswordClick}
            >
              Send reset email
            </Button>

            <Typography.Text>
              <Typography.Link onClick={() => setForgotPassword(false)}>
                Return to login
              </Typography.Link>
            </Typography.Text>
          </VSpace>
        )}

        <SocialOptions />

        {error && <Alert type="error" message={error} />}
      </VSpace>
    </Form>
  );
}
