import { Button, Input, Modal, Popconfirm, Typography } from "antd";
import React, { useState } from "react";

interface Props {
  title: string;
  description: string;
  text: string;
  confirmString: string;
  disabled?: boolean;
  onConfirm: () => (void | Promise<void>);
}

export const DoubleCheckButton: React.FC<Props> = ({
  title,
  description,
  text,
  confirmString,
  disabled,
  onConfirm,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const canDelete = confirmText === confirmString;

  const handleConfirmClick = async () => {
    await onConfirm();
    setConfirmOpen(false);
  }

  return (
    <>
      <Popconfirm
        title={title}
        description={description}
        okText={text}
        cancelText="Cancel"
        onConfirm={() => setConfirmOpen(true)}
        okButtonProps={{ color: 'danger', variant: 'outlined' }}
        
      >
        <Button color="danger" variant="outlined">
          {text}
        </Button>
      </Popconfirm>

      <Modal
        title="Destructive operation"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleConfirmClick}
        okText={text}
        cancelButtonProps={{ disabled }}
        okButtonProps={{ color: 'danger', variant: 'outlined', disabled: !canDelete || disabled }}
        cancelText="Keep my account"
        confirmLoading={disabled}
      >
        <Typography.Text>Write <strong><i>{confirmString}</i></strong> to continue</Typography.Text>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </Modal>
    </>
  )
}