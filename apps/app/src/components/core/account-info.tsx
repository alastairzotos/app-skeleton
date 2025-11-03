import { Button, Space, Tag, Typography } from "antd";
import React from "react";
import { useAuthState } from "../../state/auth";
import { capitalise } from "../../utils/misc";
import { useSubscriptionInfo } from "../../utils/profile";
import { useScreens } from "../../hooks/use-screens";
import { AccountDropdown } from "./account-dropdown";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { urls } from "@repo/common";

const TagWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const AccountInfo: React.FC = () => {
  const screens = useScreens();
  const { user, profile } = useAuthState();
  const subscriptionInfo = useSubscriptionInfo();

  if (!user || !profile) {
    return null;
  }

  return (
    <Space size="large">
      {screens.lg && (
        <Typography.Text>
          Hello {user?.user_metadata?.full_name || user?.email}
        </Typography.Text>
      )}

      {subscriptionInfo && (
        <TagWrapper>
          <Tag color={profile.tier === 'growth' ? 'green-inverse' : 'gold-inverse'}>
            {subscriptionInfo.active && capitalise(profile.tier)}
            {!subscriptionInfo.active && (
              <>
                {subscriptionInfo.daysLeftOfTrial} days left of free trial
              </>
            )}
          </Tag>

          {!subscriptionInfo.active && !subscriptionInfo.trialEnded && (
            <Button
              size="small"
              color="gold"
              variant="outlined"
            >
              <Link to={urls.billing()}>
                Upgrade
              </Link>
            </Button>
          )}
        </TagWrapper>
      )}

      <AccountDropdown />
    </Space>
  )
}
