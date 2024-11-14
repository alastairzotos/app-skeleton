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
      config: {
        credentials: {
          google: {
            id: config.get('GOOGLE_CLIENT_ID'),
            sectey: config.get('GOOGLE_CLIENT_SECRET'),
          }
        }
      }
    });
  }
}