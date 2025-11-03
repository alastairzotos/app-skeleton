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

const TierCard = styled(Card) <{ recommended?: boolean }>`
  width: ${100 / priceTiers.length}%;
  position: relative;
  transition: all 0.2s ease;
  text-align: center;
  height: fit-content;
  
  .ant-card-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    min-height: 400px;
  }
  
  ${({ recommended }) => recommended && `
    border: 2px solid #1890ff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.12);
    
    .ant-card-body {
      background-color: #fafbff;
      border-radius: 6px;
    }
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ recommended }) =>
    recommended
      ? '0 8px 24px rgba(24, 144, 255, 0.2)'
      : '0 4px 16px rgba(0, 0, 0, 0.1)'
  };
  }
`;

const RecommendedBadge = styled.div`
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  padding-top: 24px;
`;

const TierTitle = styled(Title)`
  margin-bottom: 8px !important;
  color: #1f2937;
  font-size: 24px !important;
  font-weight: 600 !important;
`;

const FeaturesList = styled(List)`
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

const Currency = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #666;
  margin-right: 2px;
`;

const Price = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
`;

const Period = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-left: 2px;
`;

interface Props {
  tier: PriceTier;
}

export const PriceTierInfo: React.FC<Props> = ({ tier }) => {
  const { profile } = useAuthState();
  const { request: createCheckoutSession, value: checkoutSessionUrl, status: createCheckoutSessionStatus } = useQuery(createCheckoutSessionRequest);

  useEffect(() => {
    if (createCheckoutSessionStatus === 'success' && checkoutSessionUrl) {
      window.location.href = checkoutSessionUrl;
    }
  }, [checkoutSessionUrl, createCheckoutSessionStatus]);

  const tierFeatures = priceTierFeatures[tier];
  const isCurrentTier = profile?.tier === tier;

  return (
    <TierCard recommended={tierFeatures.recommended}>
      {tierFeatures.recommended && (
        <RecommendedBadge>
          Recommended
        </RecommendedBadge>
      )}
      <TierTitle>{capitalise(tier)}</TierTitle>
      <PriceContainer>
        <PriceDisplay>
          <Currency>$</Currency>
          <Price>{tierFeatures.price}</Price>
          <Period>/month</Period>
        </PriceDisplay>
      </PriceContainer>
      <FeaturesList
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
              ? '#f5f5f5' 
              : tierFeatures.recommended ? '#1890ff' : '#52c41a',
            borderColor: isCurrentTier 
              ? '#d9d9d9' 
              : tierFeatures.recommended ? '#1890ff' : '#52c41a',
            color: isCurrentTier ? '#8c8c8c' : 'white',
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
