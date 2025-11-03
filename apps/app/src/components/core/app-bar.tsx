import { urls } from '@repo/common';
import { Layout, Space, theme } from 'antd';
import React from "react";
import { Link } from 'react-router-dom';
import { AccountInfo } from './account-info';
import { ColourThemeSwitch } from './colour-theme-switch';
import { Logo } from './logo';

const { Header } = Layout;

export const AppBar: React.FC = () => {
  const { token: { colorBorderSecondary } } = theme.useToken();

  return (
    <Header
      style={{
        padding: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        borderBottom: `1px solid ${colorBorderSecondary}`,
      }}
    >
      <Space>
        <Link to={urls.home()}>
          <Logo theme="dark" />
        </Link>
      </Space>

      <Space>
        <ColourThemeSwitch />

        <AccountInfo />
      </Space>
    </Header>
  )
}
