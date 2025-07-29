import { Module } from '@nestjs/common';
import { WalletManager } from './managers/wallet.manager';
import { WalletRepo } from './repos/wallet.repo';
import { WalletService } from './services/wallet.service';

@Module({
  providers: [
    // managers
    WalletManager,
    // services
    WalletService,
    // repos
    WalletRepo,
  ],
  exports: [WalletManager],
})
export class UserWalletModule {}
