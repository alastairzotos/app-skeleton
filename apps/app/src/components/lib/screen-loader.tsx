import { Layout } from "antd";
import React from "react";
import { Spinner } from "./spinner";

const { Content } = Layout;

export const ScreenLoader: React.FC = () => {
  return (
    <Layout>
      <Content>
        <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      </Content>
    </Layout>
  )
}
