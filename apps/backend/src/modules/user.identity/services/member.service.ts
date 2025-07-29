import { Injectable } from '@nestjs/common';
import { UserRepo } from '../repos/user.repo';
import { CreateMemberArg } from '../models/member.model';
import { PlayerRepo } from '../repos/player.repo';
import { AccountService } from './account.service';
import { UserType } from '../../../utils/prisma/generated/user-identity-db-client-types';

@Injectable()
export class MemberService {
  constructor(
    private readonly playerRepo: PlayerRepo,
    private readonly userRepo: UserRepo,
    private readonly accountService: AccountService
  ) {}

  async findStartWithValue(username: string) {
    return this.userRepo.findStartWithValue(username);
  }

  async create(arg: CreateMemberArg, pw: string) {
    const user = await this.accountService.create(
      {
        ...arg,
        type: UserType.MEMBER,
      },
      pw
    );

    await this.playerRepo.create(user.id);

    return user;
  }
}
