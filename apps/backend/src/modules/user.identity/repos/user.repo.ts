import { Injectable } from '@nestjs/common';
import { PrismaUserIdentityService } from '../../../utils/prisma/prisma-user-identity-db/prisma-user-identity.service';
import { CreateUserArg } from '../models/user.model';
import {
  UserDevice,
  UserStatus,
} from '../../../utils/prisma/generated/user-identity-db-client-types';
import { UserResolverService } from '../../../utils/authentication/user-resolver.service';

@Injectable()
export class UserRepo {
  constructor(
    private readonly prisma: PrismaUserIdentityService,
    private readonly userResolverService: UserResolverService
  ) {}

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOne(tenantId: string, username: string) {
    return this.prisma.user.findUnique({
      where: {
        uq_tenant_username: {
          tenantId: tenantId,
          username: username,
        },
      },
    });
  }

  async findStartWithValue(username: string) {
    return this.prisma.user.findMany({
      where: {
        username: {
          startsWith: username,
        },
      },
    });
  }

  async create(arg: CreateUserArg) {
    return this.prisma.user.create({
      data: {
        type: arg.type,
        status: UserStatus.ACTIVE,
        tenantId: arg.tenantId,
        username: arg.username,
        email: arg.email || '',
        emailConfirmed: arg.emailConfirmed || false,
        phonePrefix: arg.phonePrefix || '',
        phone: arg.phone || '',
        phoneConfirmed: arg.phoneConfirmed || false,
        agentId: arg.agentId,
        srcFrom: arg.srcFrom,
        ipFrom: arg.ipFrom,
        deviceSrc: arg.deviceSrc || UserDevice.UNKNOWN,
        latestLoginOn: arg.latestLoginOn || null,
        latestLoginIp: arg.ipFrom,
        dob: arg.dob || null,
        isPersonalInfoCompleted: false,
        createdBy: this.userResolverService.userId,
        updatedBy: this.userResolverService.userId,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    });
  }
  async activate(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new Error("this id doesn't exist at user");
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.ACTIVE,
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  async deactivate(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new Error("this id doesn't exist at user");
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  async lock(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new Error("this id doesn't exist at user");
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.LOCKED,
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  async unlock(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new Error("this id doesn't exist at user");
    if (user.status !== UserStatus.LOCKED) {
      throw new Error('this user is not locked');
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.ACTIVE,
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  async delete(id: string) {
    const user = await this.findOneById(id);
    if (!user) throw new Error("this id doesn't exist at user");
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.DELETED,
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }

  async setValid(id: string, isValid: boolean) {
    const user = await this.findOneById(id);
    if (!user) throw new Error("this id doesn't exist at user");
    return this.prisma.user.update({
      where: { id },
      data: {
        isValid,
        updatedBy: this.userResolverService.userId,
        updatedOn: new Date(),
      },
    });
  }
}
