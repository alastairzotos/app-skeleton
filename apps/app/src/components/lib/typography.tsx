import { Typography } from "antd";
import React from "react";

export const Title: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Typography.Title level={3} style={{ marginTop: 0 }}>{children}</Typography.Title>
)
