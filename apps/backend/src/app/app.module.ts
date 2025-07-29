import { Module } from '@nestjs/common';
import { UserIdentityModule } from '../modules/user.identity/user.identity.module';
import { UserWalletModule } from '../modules/user.wallet/user.wallet.module';
import { PrismaModule } from '../utils/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserResolverModule } from '../utils/authentication/user-resolver.module';
import config from '../config';

@Module({
  imports: [
    // jwt
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    // user resolver - this module provides a way to resolve the user from the request context
    UserResolverModule,
    // Import other modules here
    UserIdentityModule,
    UserWalletModule,
    PrismaModule,
  ],
  // controllers: [AppController],
  controllers: [],
  // providers: [AppService],
  providers: [],
  exports: [],
})
export class AppModule {}
