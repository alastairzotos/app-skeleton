import React from "react";
import styled from "styled-components";

interface Props {
  large?: boolean;
  width?: number | string;
  align?: 'start' | 'default';
  style?: React.CSSProperties;
}

const Spacer = styled.div<{ large?: boolean, align?: 'start' | 'default' }>(({ large, align }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: align === 'start' ? 'flex-start' : undefined,
  gap: large ? 24 : 8,
}));

export const VSpace: React.FC<React.PropsWithChildren<Props>> = ({ large, width, align, style, children }) => {
  return (
    <Spacer large={large} align={align} style={{ width: width || '100%', ...(style || {}) }}>
      {children}
    </Spacer>
  );
}
