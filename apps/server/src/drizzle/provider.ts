import { Inject, Module, Provider } from '@nestjs/common';
import * as postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { ConfigModule, ConfigService } from '@nestjs/config';

const DRIZZLE_TOKEN = 'drizzleProvider';

export const DrizzleProvider: Provider = {
  provide: DRIZZLE_TOKEN,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const client = postgres(config.get('DB_CONNECTION_STRING'));
    return drizzle(client, {
      schema,
      logger: false, // env.get().nodeEnv !== 'production',
    });
  },
};

export const InjectDb = () => Inject(DRIZZLE_TOKEN);

export type Database = PostgresJsDatabase<typeof schema>;

@Module({
  imports: [ConfigModule],
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule {}
