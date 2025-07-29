import { Injectable } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';
import { Currency } from '../../../utils/prisma/generated/user-wallet-db-client-types';

@Injectable()
export class WalletManager {
  constructor(private readonly walletService: WalletService) {}

  async create(tenantId: string, userId: string, currencies: Currency[]) {
    return this.walletService.create(tenantId, userId, currencies);
  }

  async findByUserId(userId: string) {
    return this.walletService.findByUserId(userId);
  }
}
