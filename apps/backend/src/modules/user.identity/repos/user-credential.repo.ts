import { Injectable } from '@nestjs/common';
import { PrismaUserIdentityService } from '../../../utils/prisma/prisma-user-identity-db/prisma-user-identity.service';
import { Crypto } from '../../../utils/crypto/crypto';
import { UserResolverService } from '../../../utils/authentication/user-resolver.service';

@Injectable()
export class UserCredentialRepo {
  constructor(
    private readonly prisma: PrismaUserIdentityService,
    private readonly userResolverService: UserResolverService
  ) {}

  public async findOneById(id: string) {
    return await this.prisma.userCredential.findUnique({
      where: { userId: id },
    });
  }

  public async addAccessFailedCount(userId: string): Promise<void> {
    await this.prisma.userCredential.update({
      where: { userId },
      data: {
        accessFailedCount: { increment: 1 },
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  public async create(userId: string, pw: string): Promise<void> {
    await this.prisma.userCredential.create({
      data: {
        userId,
        passwordHash: await Crypto.hashPassword(pw),
        createdBy: this.userResolverService.userId,
        updatedBy: this.userResolverService.userId,
      },
    });
  }

  public async resetAccessFailedCount(userId: string): Promise<void> {
    await this.prisma.userCredential.update({
      where: { userId },
      data: {
        accessFailedCount: 0,
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  public async resetPw(userId: string, pw: string): Promise<void> {
    await this.prisma.userCredential.update({
      where: { userId },
      data: {
        passwordHash: await Crypto.hashPassword(pw),
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  public async resetWithdrawalPw(userId: string, pw: string): Promise<void> {
    await this.prisma.userCredential.update({
      where: { userId },
      data: {
        withdrawalPasswordHash: await Crypto.hashPassword(pw),
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  public async validatePw(userId: string, pw: string): Promise<boolean> {
    const user = await this.findOneById(userId);
    if (!user)
      throw new Error(`UserCredential does not exist. value: ${userId}`);
    return Crypto.comparePassword(pw, user.passwordHash);
  }

  public async validateWithdrawalPw(
    userId: string,
    pw: string
  ): Promise<boolean> {
    const user = await this.findOneById(userId);
    if (!user || !user.withdrawalPasswordHash) return false;
    return Crypto.comparePassword(pw, user.withdrawalPasswordHash);
  }
}
