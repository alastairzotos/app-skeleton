import { Breadcrumb, Divider } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useToolbar } from "../../contexts/toolbar";
import { Spinner } from "../lib/spinner";

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginRight: theme.antd.padding,
}));

const Extras = styled.div({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
});

export interface BreadcrumbLink {
  href: string;
  title: string;
}

interface Props {
  current: string;
  list?: BreadcrumbLink[];
}

export const LOADING_BREADCRUMB = "{LOADING}";

const getNodeForBreadcrumbTitle = (title: string): React.ReactNode =>
  title === LOADING_BREADCRUMB ? <Spinner size={14} /> : <>{title}</>;

export const Breadcrumbs: React.FC<Props> = ({ current, list }) => {
  const { ref } = useToolbar();

  return (
    <>
      <Wrapper>
        <Breadcrumb
          style={{ margin: 16 }}
          items={[
            ...(list || []).map(item => ({
              title: <Link to={item.href}>{getNodeForBreadcrumbTitle(item.title)}</Link>,
            })),
            {
              title: getNodeForBreadcrumbTitle(current),
            }
          ]}
        />

        <Extras ref={ref} />
      </Wrapper>
      <Divider style={{ margin: 0 }} />
    </>
  );
};
