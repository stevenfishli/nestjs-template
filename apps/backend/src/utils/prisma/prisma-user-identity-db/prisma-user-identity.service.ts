import { PrismaClient } from '../generated/user-identity-db-client-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserIdentityService extends PrismaClient {
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
