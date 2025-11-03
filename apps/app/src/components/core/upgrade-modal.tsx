import { Modal, Typography } from "antd";
import React from "react";
import { useAuthState } from "../../state/auth";
import { useUpgradeState } from "../../state/upgrade";
import { UpgradeTiers } from "./price-tiers/upgrade-tiers";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<Props> = ({ open, onClose }) => {
  const { profile } = useAuthState();
  const { reason } = useUpgradeState();

  return (
    <Modal
      open={open}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
      width={'60%'}
      style={{ minWidth: 600 }}
      title={reason === 'limits-exceeded' ? "Limits Exceeded" : "Upgrade"}
      styles={{
        header: {
          textAlign: 'center'
        }
      }}
    >
      {profile && (
        <>
          {reason === 'limits-exceeded' && (
            <Typography.Text>
              You have exceeded the limit for the {profile.tier} plan
            </Typography.Text>
          )}

          {reason === 'upgrade' && <UpgradeTiers />}
        </>
      )}
    </Modal>
  )
}
