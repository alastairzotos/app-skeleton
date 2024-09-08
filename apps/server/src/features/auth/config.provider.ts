import { Inject, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppInfo } from "supertokens-node/types";

const SUPERTOKENS_TOKEN = 'ConfigInjectionToken';

export const SupertokensProvider: Provider = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AuthModuleConfig => ({
    appInfo: {
      appName: configService.get('APP_NAME'),
      apiDomain: configService.get('API_URL'),
      websiteDomain: configService.get('CLIENT_URL'),
      apiBasePath: '/api/v1/auth',
      websiteBasePath: '/auth',
    },
    connectionURI: configService.get('SUPERTOKENS_CONNECTION_URI'),
  }),
  provide: SUPERTOKENS_TOKEN,
};

export const InjectSuperTokens = () => Inject(SUPERTOKENS_TOKEN);

export type AuthModuleConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey?: string;
}
