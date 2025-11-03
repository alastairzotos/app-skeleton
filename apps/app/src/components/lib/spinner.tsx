import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";
import React from "react";

interface Props {
  size?: number;
}

export const Spinner: React.FC<Props> = ({ size = 48 }) => {
  return <Spin indicator={<LoadingOutlined style={{ fontSize: size }} spin />} />
}
