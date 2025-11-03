import { urls } from "@repo/common";
import { Alert, Button, Input, Typography } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import { VSpace } from "../lib/vertical-space";

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [done, setDone] = useState(false);

  const hasValidPassword = password.trim().length >= 8 && password2 === password;

  const handleResetPasswordClick = async () => {
    setUpdating(false);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
    }

    setUpdating(false);
  }

  if (done) {
    return (
      <VSpace>
        <Typography.Text>Password changed</Typography.Text>

        <Button>
          <Link to={urls.home()}>
            Return to dashboard
          </Link>
        </Button>
      </VSpace>
    )
  }

  return (
    <VSpace>
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={4}>Reset password</Typography.Title>
      </div>

      <Input
        placeholder="New password"
        type="password"
        value={password}
        size="large"
        onChange={e => setPassword(e.target.value)}
      />

      <Input
        placeholder="Repeat password"
        type="password"
        value={password2}
        size="large"
        onChange={e => setPassword2(e.target.value)}
      />

      <Button
        type="primary"
        style={{ width: '100%' }}
        size="large"
        disabled={!hasValidPassword || updating}
        loading={updating}
        onClick={handleResetPasswordClick}
      >
        Reset password
      </Button>

      {error && <Alert type="error" message={error} />}
    </VSpace>
  )
}
