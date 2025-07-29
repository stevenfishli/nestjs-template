import { Global, Module } from '@nestjs/common';
import { PrismaUserIdentityService } from './prisma-user-identity-db/prisma-user-identity.service';
import { PrismaUserWalletService } from './prisma-user-wallet-db/prisma-user-wallet.service';

@Global()
@Module({
  providers: [PrismaUserIdentityService, PrismaUserWalletService],
  exports: [PrismaUserIdentityService, PrismaUserWalletService],
})
export class PrismaModule {}
