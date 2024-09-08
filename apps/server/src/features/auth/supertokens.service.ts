import { Inject, Injectable } from '@nestjs/common';
import supertokens from "supertokens-node";
import Session from 'supertokens-node/recipe/session';
import ThirdParty from "supertokens-node/recipe/thirdparty"
import EmailPassword from "supertokens-node/recipe/emailpassword"
import { ConfigService } from '@nestjs/config';
import { AuthModuleConfig, InjectSuperTokens } from 'features/auth/config.provider';
import Dashboard from "supertokens-node/recipe/dashboard";

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
        EmailPassword.init({}),
        ThirdParty.init({
          // We have provided you with development keys which you can use for testing.
          // IMPORTANT: Please replace them with your own OAuth keys for production use.
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
          }
        }),
        Session.init(),
        Dashboard.init({
          admins: ['alastairzotos@gmail.com'],
        }),
      ],
    });
  }
}