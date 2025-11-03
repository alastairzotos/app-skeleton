import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const NodeContainer = styled.div({
  marginTop: 10,
  marginBottom: 10,
})

export interface FormItemProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  node?: React.ReactNode;
  warnings?: Array<string | boolean | null>;
  hidden?: boolean;
  tooltip?: React.ReactNode;
}

export const FormItem: React.FC<FormItemProps> = ({ label, description, node, warnings, hidden, tooltip }) => {
  if (hidden) {
    return;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={5} style={{ marginBottom: 0, marginTop: 0 }}>{label}</Typography.Title>
        {tooltip && (
          <Tooltip
            title={tooltip}
            placement="right"
            autoAdjustOverflow={false}
            styles={{
              body: {
                width: 500
              }
            }}
            arrow={{ pointAtCenter: true }}
          >
            <InfoCircleOutlined />
          </Tooltip>
        )}
      </div>

      {description && (
        <div>
          <Typography.Text type="secondary">{description}</Typography.Text>
        </div>
      )}

      {node && (
        <NodeContainer>
          {node}
        </NodeContainer>
      )}

      {warnings && (
        <div>
          {warnings.filter(Boolean).map((warning, index) => (
            <Typography.Text key={index} type="warning">{warning}</Typography.Text>
          ))}
        </div>
      )}
    </div>
  )
}
