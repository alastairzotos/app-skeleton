import { Space, theme, Typography } from "antd";
import React from "react";
import { BarLoader, PulseLoader } from 'react-spinners';
import styled from "styled-components";
import type { FetchStatus } from "../../hooks/use-query";
import { Spinner } from "./spinner";

const Wrapper = styled(Space)<{ $fullheight?: boolean }>(({ $fullheight }) => ({
  width: '100%',
  height: $fullheight ? '100%' : 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}))

type LoadingIndicator = 'spinner' | 'bar' | 'pulse';

interface Props {
  status: FetchStatus | undefined;
  spinnerSize?: number;
  fetchingText?: React.ReactNode;
  errorText?: React.ReactNode;
  fullHeight?: boolean;
  indicator?: LoadingIndicator;
}

export const StatusSwitch: React.FC<React.PropsWithChildren<Props>> = ({
  status,
  spinnerSize,
  fetchingText,
  errorText = <Typography.Text>There was an unexpected error</Typography.Text>,
  fullHeight = true,
  indicator = 'spinner',
  children,
}) => {
  const {
    token: { colorPrimary }
  } = theme.useToken();

  return (
    <>
      {status && status !== 'success' && (
        <Wrapper direction="vertical" $fullheight={fullHeight}>
          {status === 'fetching' && (
            <>
              {indicator === 'spinner' && <Spinner size={spinnerSize} />}
              {indicator === 'bar' && <BarLoader color={colorPrimary} />}
              {indicator === 'pulse' && <PulseLoader color={colorPrimary} />}
              {fetchingText}
            </>
          )}
          {status === 'error' && errorText}
        </Wrapper>
      )}

      {status === 'success' && (
        <>
          {children}
        </>
      )}
    </>
  )
}
