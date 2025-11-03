import { CreditCardOutlined, HomeOutlined } from '@ant-design/icons';
import { urls } from '@repo/common';
import { Layout, Menu, theme } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { getEnv } from '../../utils/env';
import { useScreens } from '../../hooks/use-screens';

const { Sider } = Layout;

type MenuItem = {
  key: string,
  icon: React.ReactElement,
  label: string,
}

const MenuInner = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  height: '100%',
  justifyContent: 'space-between',
  overflowX: 'hidden',
})

const Version = styled.span({
  textWrap: 'nowrap',
  color: '#999',
  margin: 16,
  fontWeight: 100,
})

const homeMenuItem: MenuItem = {
  key: urls.home(),
  icon: React.createElement(HomeOutlined),
  label: 'Home',
};

const billingMenuItem: MenuItem = {
  key: urls.billing(),
  icon: React.createElement(CreditCardOutlined),
  label: 'Billing',
}

export const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { token: { colorBorderSecondary }} = theme.useToken();
  const screens = useScreens();

  let items: MenuItem[] = [homeMenuItem, billingMenuItem];

  const current = [...items].reverse().find(item => {
    const parts = pathname.split('/').filter(part => part.trim().length);
    const itemParts = item.key.split('/').filter(part => part.trim().length);
    if (parts[0] === itemParts[0]) {
      return true;
    }
  });

  const colourTheme = "dark";

  return (
    <Sider
      width={250}
      breakpoint="lg"
      collapsedWidth="60"
      theme={colourTheme}
      style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
    >
      <MenuInner>
        <div>
          <Menu
            theme={colourTheme}
            mode="inline"
            selectedKeys={[current?.key || urls.home()]}
            items={items}
            onClick={item => navigate(item.key)}
          />
        </div>

        {screens.lg && <Version>{getEnv().appVersion}</Version>}
      </MenuInner>
    </Sider>
  )
}
