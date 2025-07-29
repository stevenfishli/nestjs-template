import { Injectable } from '@nestjs/common';
import { PrismaUserWalletService } from '../../../utils/prisma/prisma-user-wallet-db/prisma-user-wallet.service';
import { UserResolverService } from '../../../utils/authentication/user-resolver.service';
import { Currency } from '../../../utils/prisma/generated/user-wallet-db-client-types';

@Injectable()
export class WalletRepo {
  constructor(
    private readonly prisma: PrismaUserWalletService,
    private readonly userResolverService: UserResolverService
  ) {}

  async create(tenantId: string, userId: string, currencies: Currency[]) {
    const now = new Date();
    const createdBy = this.userResolverService.userId;

    await this.prisma.wallet.createMany({
      data: currencies.map((currency) => ({
        tenantId: tenantId,
        userId: userId,
        currency: currency,
        balance: 0,
        createdBy: createdBy,
        createdOn: now,
        updatedBy: createdBy,
        updatedOn: now,
      })),
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.wallet.findFirst({ where: { userId: userId } });
  }
}
