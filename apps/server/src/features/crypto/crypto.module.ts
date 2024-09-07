import { Module } from "@nestjs/common";
import { CryptoService } from "features/crypto/crypto.service";

@Module({
  imports: [],
  exports: [CryptoService],
  providers: [CryptoService],
})
export class CryptoModule { }
