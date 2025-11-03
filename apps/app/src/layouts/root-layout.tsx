import { ConfigProvider, theme } from "antd";
import { type GlobalToken } from "antd/es/theme/interface";
import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Page } from "../components/core/page";
import { Startup } from "../components/core/startup";
import { useGetColourTheme } from "../state/theme";

export interface CustomTheme {
  antd: GlobalToken;
}

declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme { }
}

const LayoutInner: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <ThemeProvider theme={{ antd: token }}>
      <Startup>
        <Page>
          <Outlet />
        </Page>
      </Startup>
    </ThemeProvider>
  )
}

export const RootLayout: React.FC = () => {
  const colourTheme = useGetColourTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: colourTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <LayoutInner />
    </ConfigProvider>
  )
}
