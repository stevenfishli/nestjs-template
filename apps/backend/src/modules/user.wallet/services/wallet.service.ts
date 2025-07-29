import { Injectable } from '@nestjs/common';
import { WalletRepo } from '../repos/wallet.repo';
import { Currency } from '../../../utils/prisma/generated/user-wallet-db-client-types';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepo: WalletRepo) {}

  async create(tenantId: string, userId: string, currencies: Currency[]) {
    await this.walletRepo.create(tenantId, userId, currencies);
  }

  async findByUserId(userId: string) {
    return this.walletRepo.findByUserId(userId);
  }
}
