import { urls } from "@repo/common";
import { Button, Card, Descriptions, Space } from "antd";
import dayjs from 'dayjs';
import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "../../state/auth";
import { SubscriptionText } from "../lib/subscription-text";
import { VSpace } from "../lib/vertical-space";
import { ChangePasswordButton } from "./change-password-button";
import { DeleteAccountButton } from "./delete-button";

export const AccountView: React.FC = () => {
  const { user, profile } = useAuthState();
  
  if (!user) {
    return null;
  }

  return (
    <VSpace>
      <Card title="Basics">
        <Descriptions
          layout="horizontal"
          column={1}
          items={[
            {
              key: 'email',
              label: 'Email',
              children: user.email,
            },
            {
              key: 'role',
              label: 'Role',
              children: profile?.role,
            },
            {
              key: 'created',
              label: 'Created',
              children: dayjs(profile?.createdAt).format('DD MMMM YYYY'),
            },
          ]}
        />
      </Card>

      <Card title="Subscription">
        <VSpace large>
          <SubscriptionText />

          <Link to={urls.billing()}>
            <Button>
              Go to billing settings
            </Button>
          </Link>
        </VSpace>
      </Card>

      <Card title="Actions">
        <Space>
          <ChangePasswordButton />
          <DeleteAccountButton />
        </Space>
      </Card>
    </VSpace>
  )
}
