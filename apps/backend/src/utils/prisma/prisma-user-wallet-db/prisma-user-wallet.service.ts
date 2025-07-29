import { PrismaClient } from '../generated/user-wallet-db-client-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserWalletService extends PrismaClient {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
