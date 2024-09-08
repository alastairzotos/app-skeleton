import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import supertokens from "supertokens-node";
import Session from 'supertokens-node/recipe/session';
import ThirdParty from "supertokens-node/recipe/thirdparty"
import EmailPassword from "supertokens-node/recipe/emailpassword"
import Dashboard from "supertokens-node/recipe/dashboard";
import UserMetadata from "supertokens-node/recipe/usermetadata";

import { AuthModuleConfig, InjectSuperTokens } from 'features/auth/config.provider';

@Injectable()
export class SupertokensService {
  constructor(
    configService: ConfigService,
    @InjectSuperTokens() supertokensConfig: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: supertokensConfig.appInfo,
      supertokens: {
        connectionURI: supertokensConfig.connectionURI,
        apiKey: supertokensConfig.apiKey,
      },
      recipeList: [
        EmailPassword.init({
          override: {
            apis: (originalImplementation) => ({
              ...originalImplementation,
              signUpPOST: async function (input) {
                const response = await originalImplementation.signUpPOST!(input);
                
                if (response.status === 'OK') {
                  await UserMetadata.updateUserMetadata(response.user.id, {
                    role: 'user',
                    preferences: { theme: 'light' },
                  });
                }

                return response;
              },
            }),
          },
        }),

        ThirdParty.init({
          signInAndUpFeature: {
            providers: [
              {
                config: {
                  thirdPartyId: "google",
                  clients: [{
                    clientId: configService.get('GOOGLE_CLIENT_ID'),
                    clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
                  }]
                }
              },
            ],
          },
          override: {
            apis: (originalImplementation) => ({
              ...originalImplementation,
              signInUpPOST: async function (input) {
                const response = await originalImplementation.signInUpPOST!(input);

                if (response.status === 'OK' && response.createdNewRecipeUser) {
                  await UserMetadata.updateUserMetadata(response.user.id, {
                    role: 'user',
                    preferences: { theme: 'light' },
                  });
                }

                return response;
              },
            }),
          }
        }),

        Session.init(),

        Dashboard.init({
          admins: ['alastairzotos@gmail.com'],
        }),

        UserMetadata.init(),
      ],
    });
  }
}
