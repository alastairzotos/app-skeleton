import { Button, Card, Divider, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../hooks/use-query";
import { cancelSubscriptionRequest, createPortalSessionRequest } from "../../requests/billing";
import { useUpgradeState } from "../../state/upgrade";
import { getEnv } from "../../utils/env";
import { useSubscriptionInfo } from "../../utils/profile";
import { DoubleCheckButton } from "../lib/double-check-button";
import { SubscriptionText } from "../lib/subscription-text";
import { VSpace } from "../lib/vertical-space";

export const Billing: React.FC = () => {
  const subscriptionInfo = useSubscriptionInfo();
  const navigate = useNavigate();

  const { appName } = getEnv();

  const { request: cancelSubscription, status: cancelSubscriptionStatus } = useQuery(cancelSubscriptionRequest);
  const { request: createPortalSession, status: createPortalStatus } = useQuery(createPortalSessionRequest);

  const { setUpdateModalOpen } = useUpgradeState();

  const handleCancelSubscriptionClick = async () => {
    await cancelSubscription();
    navigate(0);
  }

  const handlePortalClick = async () => {
    const portalUrl = await createPortalSession();
    window.open(portalUrl, '_blank')?.focus();
  }

  return (
    <>
      <Card title="Billing information">
        <VSpace align="start" large>
          <SubscriptionText />

          {(!subscriptionInfo?.active || subscriptionInfo.trialEnded) && (
            <Typography.Text>
              Add your payment details to ensure continued access to {appName}
            </Typography.Text>
          )}
          <Button
            variant="solid"
            color="green"
            size="large"
            onClick={() => setUpdateModalOpen(true, 'upgrade')}
          >
            {(!subscriptionInfo?.active || subscriptionInfo.trialEnded) && "Upgrade"}
            {subscriptionInfo?.active && "Change plan"}
          </Button>

          {subscriptionInfo?.active && (
            <DoubleCheckButton
              title="Are you sure?"
              description="If you cancel your subscription you will not be able to use the API and test your content"
              confirmString="unsubscribe"
              text="Cancel subscription"
              onConfirm={handleCancelSubscriptionClick}
              disabled={cancelSubscriptionStatus === 'fetching'}
            />
          )}

          {subscriptionInfo?.active && (
            <VSpace align="start">
              <Divider />
              <Button
                loading={createPortalStatus === 'fetching'}
                onClick={handlePortalClick}
              >
                View on Stripe
              </Button>
              <Typography.Text italic type="secondary">
                View invoices and edit payment methods
              </Typography.Text>
            </VSpace>
          )}
        </VSpace>
      </Card>
    </>
  )
}
