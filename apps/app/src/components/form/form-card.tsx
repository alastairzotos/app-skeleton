import { Card, Space, theme, Typography } from "antd";
import React from "react";
import { VSpace } from "../lib/vertical-space";
import { FormItem, type FormItemProps } from "./form-item";

interface Props {
  title?: string;
  subtitle?: string;
  items: Array<FormItemProps | null>;
  footer?: React.ReactNode;
}

export const FormCard: React.FC<Props> = ({ title, subtitle, items, footer }) => {
  const {
    token: {
      colorBgBlur: bgColor,
    }
  } = theme.useToken();

  return (
    <Card
      title={title}
      style={{ backgroundColor: bgColor }}
      styles={{
        title: { fontSize: '1.5em', margin: 12, marginLeft: 0 },
        header: { padding: 0, paddingLeft: 24 },
        body: { maxWidth: 600 },
      }}
    >
      {subtitle && (
        <Typography.Text>{subtitle}</Typography.Text>
      )}

      <VSpace large>
        {items.filter(i => !!i).map((item, index) => (
          <FormItem key={index} {...item} />
        ))}
      </VSpace>

      {footer && (
        <Space style={{ paddingTop: 30 }}>{footer}</Space>
      )}
    </Card>
  )
}
