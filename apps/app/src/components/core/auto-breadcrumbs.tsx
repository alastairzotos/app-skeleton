import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { type BreadcrumbLink, Breadcrumbs, LOADING_BREADCRUMB } from "./breadcrumbs";
import { capitalise, useCurrentRoute } from "../../utils/misc";
import { useAuthState } from "../../state/auth";

const extractKey = (key: string) => key.substring(1);
const removeHyphens = (text = "") => text.split("-").join(" ");

const paramResolvers: Record<string, (id: string) => Promise<string>> = {
  // ":siteId": async (id) => (await getSiteByIdRequest(id)).name,
};

const buildBreadcrumbsFromParts = async (
  parts: string[],
  params: Record<string, string | undefined>,
  resolveTitle: (part: string, id: string) => Promise<string>
): Promise<BreadcrumbLink[]> => {
  const links: BreadcrumbLink[] = [];

  const linkBuild = [];

  for (const part of parts) {
    let title: string | undefined;

    if (part in paramResolvers) {
      const key = extractKey(part);
      const id = params[key];
      linkBuild.push(id);
      try {
        title = await resolveTitle(part, id!);
      } catch {
        title = id;
      }
    } else {
      linkBuild.push(part);
    }

    links.push({
      title: title || capitalise(removeHyphens(part)),
      href: "/" + linkBuild.join("/"),
    });
  }

  return links;
};

export const AutoBreadcrumbs: React.FC = () => {
  const { accessToken } = useAuthState();
  const { pathname } = useLocation();
  const currentRoute = useCurrentRoute();
  const params = useParams();

  const path = currentRoute.substring(1);
  const parts = path.split("/");

  const [crumbs, setCrumbs] = useState<BreadcrumbLink[]>([]);

  useEffect(() => {
    buildBreadcrumbsFromParts(
      parts,
      params,
      async () => LOADING_BREADCRUMB
    )
      .then(setCrumbs)
      .then(() =>
        buildBreadcrumbsFromParts(
          parts,
          params,
          async (part, id) => paramResolvers[part](id)
        )
      )
      .then(setCrumbs);
  }, [pathname]);

  if (!accessToken || !crumbs.length || pathname === "/") {
    return null;
  }

  return (
    <Breadcrumbs
      list={crumbs.slice(0, crumbs.length - 1)}
      current={crumbs[crumbs.length - 1].title}
    />
  );
};
