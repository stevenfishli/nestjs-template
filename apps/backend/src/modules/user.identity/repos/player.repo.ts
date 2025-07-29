import { Injectable } from '@nestjs/common';
import { PrismaUserIdentityService } from '../../../utils/prisma/prisma-user-identity-db/prisma-user-identity.service';

@Injectable()
export class PlayerRepo {
  constructor(private readonly prisma: PrismaUserIdentityService) {}
  public async findOneByUserId(userId: string) {
    return await this.prisma.player.findUnique({
      where: { userId: userId },
    });
  }

  public async create(userId: string) {
    await this.prisma.player.create({
      data: { userId },
    });
  }
}
