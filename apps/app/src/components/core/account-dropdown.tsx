import { Avatar, Dropdown } from "antd";
import { UserOutlined } from '@ant-design/icons';
import React from "react";
import { Link } from "react-router-dom";
import { urls } from "@repo/common";
import { handleLogout } from "../../utils/auth";

export const AccountDropdown: React.FC = () => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'account',
            label: (
              <Link to={urls.account()}>
                Account
              </Link>
            )
          },
          {
            key: 'logout',
            label: (
              <a onClick={handleLogout}>
                Logout
              </a>
            ),
          }
        ]
      }}
    >
      <Avatar icon={<UserOutlined />} />
    </Dropdown>
  );
}
