import { Card } from "antd";
import React from "react";
import styled from "styled-components";
import { Logo } from "../core/logo";

const Wrapper = styled.div({
  width: '100%',
  height: '100vh',
  backgroundColor: '#f8f8f8',
  display: 'flex',
  justifyContent: 'center',
});

const FormContainer = styled.div({
  marginTop: 48,
  textAlign: 'center',
});

const FormCard = styled(Card)({
  width: 400,
});

export const AuthPageWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Wrapper>
      <FormContainer>
        <FormCard>
          <Logo />
          {children}
        </FormCard>
      </FormContainer>
    </Wrapper>
  )
}
