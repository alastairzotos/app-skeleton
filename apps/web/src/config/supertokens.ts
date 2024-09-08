import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import ThirdParty, { Github, Google, Facebook, Apple } from "supertokens-auth-react/recipe/thirdparty";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import Router from 'next/router'

import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import { getEnv } from "@/utils/env";

export const supertokensConfig = (): SuperTokensConfig => ({
  appInfo: {
    appName: "Instafinds",
    apiDomain: getEnv().apiUrl,
    websiteDomain: getEnv().clientUrl,
    apiBasePath: "/api/v1/auth",
    websiteBasePath: "/auth"
  },
  recipeList: [
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [
          Github.init(),
          Google.init(),
          Facebook.init(),
          Apple.init(),
        ]
      }
    }),
    EmailPassword.init(),
    Session.init()
  ],
  windowHandler: (oI) => {
    return {
      ...oI,
      location: {
        ...oI.location,
        setHref: (href) => {
          Router.push(href)
        },
      },
    }
  },
});

export const prebuildUIs = () => ([
  EmailPasswordPreBuiltUI,
  ThirdPartyPreBuiltUI,
]);