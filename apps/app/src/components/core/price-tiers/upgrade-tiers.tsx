import { priceTiers } from "@repo/common";
import type React from "react";
import { PriceTierInfo } from "./price-tier-info";
import styled from "styled-components";

const Wrapper = styled.div({
  width: '100%',
  display: 'flex',
  gap: 8,
  justifyContent: 'center',
  marginTop: 24,
})

export const UpgradeTiers: React.FC = () => {
  return (
    <Wrapper>
      {priceTiers.map((tier) => (
        <PriceTierInfo key={tier} tier={tier} />
      ))}
    </Wrapper>
  )
}
