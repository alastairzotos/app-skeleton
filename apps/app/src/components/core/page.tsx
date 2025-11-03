import React, { useRef } from "react";

import { ConfigProvider, Layout, theme } from 'antd';
import { useLocation } from "react-router-dom";
import { useUpgradeState } from "../../state/upgrade";
import { APP_BAR_HEIGHT } from "../../utils/constants";
import { AppBar } from "./app-bar";
import { AutoBreadcrumbs } from "./auto-breadcrumbs";
import { SideMenu } from "./side-menu";
import { UpgradeModal } from "./upgrade-modal";
import { ToolbarContextProvider } from "../../contexts/toolbar";

const { Content } = Layout;

export const Page: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isUpgradeModalOpen, setUpdateModalOpen } = useUpgradeState();

  const { pathname } = useLocation();

  const breadcrumbExtrasRef = useRef<HTMLDivElement>(null);

  if (['/auth'].find(exemption => pathname.startsWith(exemption))) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <ToolbarContextProvider value={{ ref: breadcrumbExtrasRef }}>
      <Layout style={{ height: '100vh' }}>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <AppBar />
        </ConfigProvider>

        <Layout>
          <SideMenu />

          <Content>
            <AutoBreadcrumbs />

            <div
              style={{
                height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
                overflowY: 'scroll',
                padding: 12
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>

      <UpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />
    </ToolbarContextProvider>
  );
};