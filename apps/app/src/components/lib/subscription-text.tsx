import React from "react";
import { useSubscriptionInfo } from "../../utils/profile";
import { Typography } from "antd";
import { useAuthState } from "../../state/auth";
import { VSpace } from "./vertical-space";
import dayjs from "dayjs";

export const SubscriptionText: React.FC = () => {
  const { profile } = useAuthState();
  const subscriptionInfo = useSubscriptionInfo();

  return (
    <VSpace large>
      <Typography.Text>
        Your subscription is{' '}
        <Typography.Text type={subscriptionInfo?.active ? "success" : "warning"}>
          {subscriptionInfo?.active ? "active" : "inactive"}
        </Typography.Text>
        {subscriptionInfo?.active && (
          <>{' '}for the <Typography.Text type="success" strong>{profile?.tier}</Typography.Text> plan</>
        )}
      </Typography.Text>

      {subscriptionInfo?.active && (
        <Typography.Text>Your next payment date is {dayjs(profile?.nextBillingDate).format('DD MMMM YYYY')}</Typography.Text>
      )}

      {!subscriptionInfo?.active && !subscriptionInfo?.trialEnded && (
        <Typography.Text>You have {subscriptionInfo?.daysLeftOfTrial} days left of your free trial</Typography.Text>
      )}
    </VSpace>
  )
}
