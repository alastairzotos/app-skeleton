import { Persona } from "@bitmetro/persona-node";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthAdapter } from "./auth.adapter";

@Injectable()
export class AuthService {
  persona: Persona;

  constructor(
    config: ConfigService,
    adapter: AuthAdapter,
  ) {
    this.persona = new Persona({
      jwtSigningKey: config.get('JWT_SIGNING_KEY'),
      adapter,
      host: config.get('API_URL'),
      clientUrls: [config.get('CLIENT_URL')],
      config: {
        credentials: {
          google: {
            id: config.get('GOOGLE_CLIENT_ID'),
            secret: config.get('GOOGLE_CLIENT_SECRET'),
          },
        }
      }
    });
  }
}