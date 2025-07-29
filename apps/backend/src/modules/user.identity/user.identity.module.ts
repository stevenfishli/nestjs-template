import { Module } from '@nestjs/common';
import { MemberService } from './services/member.service';
import { UserRepo } from './repos/user.repo';
import { UserWalletModule } from '../user.wallet/user.wallet.module';
import { BO_MemberController } from './controllers/bo/member.controller';
import { FE_AccountController } from './controllers/fe/account.controller';
import { UserCredentialRepo } from './repos/user-credential.repo';
import { PlayerRepo } from './repos/player.repo';
import { AccountService } from './services/account.service';

@Module({
  imports: [UserWalletModule],
  controllers: [BO_MemberController, FE_AccountController],
  providers: [
    // services
    AccountService,
    MemberService,
    // repos
    PlayerRepo,
    UserRepo,
    UserCredentialRepo,
  ],
  exports: [],
})
export class UserIdentityModule {}
