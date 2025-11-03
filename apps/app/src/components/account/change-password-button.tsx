import { Alert, Button, Input, Modal, Typography } from "antd";
import React, { useState } from "react";
import { useAuthState } from "../../state/auth";
import { FormItem } from "../form/form-item";
import { supabase } from "../../supabase";

export const ChangePasswordButton: React.FC = () => {
  const { user } = useAuthState();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleOkClick = async () => {
    if (done) {
      setModalOpen(false);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
    }

    setLoading(false);
  }

  const canClickOk = password.length >= 8 && password2 === password;

  if (user?.app_metadata.provider !== 'email') {
    return;
  }

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        Change password
      </Button>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        okText={done ? 'Close' : 'Change password'}
        onOk={handleOkClick}
        okButtonProps={{ loading, disabled: !canClickOk }}
        cancelButtonProps={{ loading }}
      >
        {!done && (
          <>
            <FormItem
              label="Enter new password"
              node={(
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
            />

            <FormItem
              label="Repeat password"
              node={(
                <Input
                  type="password"
                  placeholder="Repeat password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              )}
            />

            {error && <Alert type="error" message={error} />}
          </>
        )}

        {done && (
          <Typography.Text>Password changed successfully</Typography.Text>
        )}
      </Modal>
    </>
  )
}
