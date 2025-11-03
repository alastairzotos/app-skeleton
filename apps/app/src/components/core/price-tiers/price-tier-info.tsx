import { priceTierFeatures, priceTiers, type PriceTier } from "@repo/common";
import { Button, Card, List, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type React from "react";
import { useEffect } from "react";
import { useQuery } from "../../../hooks/use-query";
import { createCheckoutSessionRequest } from "../../../requests/billing";
import { capitalise } from "../../../utils/misc";
import { Title } from "../../lib/typography";
import styled from "styled-components";
import { useAuthState } from "../../../state/auth";
import { useGetColourTheme } from "../../../state/theme";

const TierCard = styled(Card) <{ recommended?: boolean; $theme: 'light' | 'dark' }>`
  width: ${100 / priceTiers.length}%;
  position: relative;
  transition: all 0.2s ease;
  text-align: center;
  height: fit-content;
  background-color: ${({ $theme }) => $theme === 'dark' ? '#1f1f1f' : '#ffffff'};
  border: 1px solid ${({ $theme }) => $theme === 'dark' ? '#424242' : '#d9d9d9'};
  
  .ant-card-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    min-height: 400px;
    background-color: ${({ $theme }) => $theme === 'dark' ? '#1f1f1f' : '#ffffff'};
    border-radius: 8px;
  }
  
  ${({ recommended, $theme }) => recommended && `
    border: 2px solid #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.12);
    
    .ant-card-body {
      background-color: ${$theme === 'dark' ? '#252525' : '#fafbff'};
      border-radius: 6px;
    }
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ recommended, $theme }) =>
    recommended
      ? '0 8px 24px rgba(24, 144, 255, 0.2)'
      : $theme === 'dark' 
        ? '0 4px 16px rgba(255, 255, 255, 0.1)'
        : '0 4px 16px rgba(0, 0, 0, 0.1)'
  };
  }
`;

const RecommendedBadge = styled.div<{ $theme: 'light' | 'dark' }>`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1890ff;
  color: white;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: ${({ $theme }) => 
    $theme === 'dark' 
      ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1)'
  };
  z-index: 2;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  padding-top: 24px;
`;

const TierTitle = styled(Title)<{ $theme: 'light' | 'dark' }>`
  margin-bottom: 8px !important;
  color: ${({ $theme }) => $theme === 'dark' ? '#ffffff' : '#1f2937'} !important;
  font-size: 24px !important;
  font-weight: 600 !important;
`;

const FeaturesList = styled(List)<{ $theme: 'light' | 'dark' }>`
  .ant-list-item {
    border: none !important;
    padding: 8px 0 !important;
    display: flex;
    align-items: flex-start;
    text-align: left;
  }
  
  .ant-typography {
    font-size: 14px;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: ${({ $theme }) => $theme === 'dark' ? '#ffffff' : 'inherit'} !important;
  }
  
  .ant-typography.ant-typography-secondary {
    color: ${({ $theme }) => $theme === 'dark' ? '#b0b0b0' : 'rgba(0, 0, 0, 0.45)'} !important;
  }
`;

const FeatureIcon = styled.span`
  display: inline-flex;
  margin-top: 5px;
  font-size: 12px;
`;

const PriceContainer = styled.div`
  text-align: center;
  margin: 16px 0 24px 0;
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
`;

const Currency = styled.span<{ $theme: 'light' | 'dark' }>`
  font-size: 18px;
  font-weight: 500;
  color: ${({ $theme }) => $theme === 'dark' ? '#b0b0b0' : '#666'};
  margin-right: 2px;
`;

const Price = styled.span<{ $theme: 'light' | 'dark' }>`
  font-size: 32px;
  font-weight: 700;
  color: ${({ $theme }) => $theme === 'dark' ? '#ffffff' : '#1f2937'};
  line-height: 1;
`;

const Period = styled.span<{ $theme: 'light' | 'dark' }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $theme }) => $theme === 'dark' ? '#b0b0b0' : '#666'};
  margin-left: 2px;
`;

interface Props {
  tier: PriceTier;
}

export const PriceTierInfo: React.FC<Props> = ({ tier }) => {
  const { profile } = useAuthState();
  const { request: createCheckoutSession, value: checkoutSessionUrl, status: createCheckoutSessionStatus } = useQuery(createCheckoutSessionRequest);

  const theme = useGetColourTheme();

  useEffect(() => {
    if (createCheckoutSessionStatus === 'success' && checkoutSessionUrl) {
      window.location.href = checkoutSessionUrl;
    }
  }, [checkoutSessionUrl, createCheckoutSessionStatus]);

  const tierFeatures = priceTierFeatures[tier];
  const isCurrentTier = profile?.tier === tier;

  return (
    <TierCard recommended={tierFeatures.recommended} $theme={theme}>
      {tierFeatures.recommended && (
        <RecommendedBadge $theme={theme}>
          Recommended
        </RecommendedBadge>
      )}
      <TierTitle $theme={theme}>{capitalise(tier)}</TierTitle>
      <PriceContainer>
        <PriceDisplay>
          <Currency $theme={theme}>$</Currency>
          <Price $theme={theme}>{tierFeatures.price}</Price>
          <Period $theme={theme}>/month</Period>
        </PriceDisplay>
      </PriceContainer>
      <FeaturesList
        $theme={theme}
        dataSource={tierFeatures.active}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text>
              <FeatureIcon>
                <CheckOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              </FeatureIcon>
              {String(item)}
            </Typography.Text>
          </List.Item>
        )}
      />
      {tierFeatures.inactive && (
        <FeaturesList
          $theme={theme}
          dataSource={tierFeatures.inactive}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text type="secondary">
                <FeatureIcon>
                  <CloseOutlined style={{ color: '#ff4d4f', fontSize: '12px' }} />
                </FeatureIcon>
                {String(item)}
              </Typography.Text>
            </List.Item>
          )}
        />
      )}

      <ButtonWrapper>
        <Button
          key={tier}
          type={isCurrentTier ? "default" : "primary"}
          shape="round"
          size="large"
          loading={createCheckoutSessionStatus === 'fetching'}
          onClick={() => !isCurrentTier && createCheckoutSession(tier)}
          disabled={isCurrentTier}
          style={{ 
            width: '100%',
            height: '44px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: isCurrentTier 
              ? (theme === 'dark' ? '#2f2f2f' : '#f5f5f5')
              : tierFeatures.recommended ? '#1890ff' : '#52c41a',
            borderColor: isCurrentTier 
              ? (theme === 'dark' ? '#424242' : '#d9d9d9')
              : tierFeatures.recommended ? '#1890ff' : '#52c41a',
            color: isCurrentTier 
              ? (theme === 'dark' ? '#888888' : '#8c8c8c')
              : 'white',
            boxShadow: isCurrentTier 
              ? 'none'
              : tierFeatures.recommended 
                ? '0 2px 4px rgba(24, 144, 255, 0.2)' 
                : '0 2px 4px rgba(82, 196, 26, 0.2)',
            cursor: isCurrentTier ? 'not-allowed' : 'pointer'
          }}
        >
          {isCurrentTier 
            ? 'Current Plan' 
            : tierFeatures.recommended 
              ? 'Get Started' 
              : 'Choose Plan'}
        </Button>
      </ButtonWrapper>
    </TierCard>
  )
}
