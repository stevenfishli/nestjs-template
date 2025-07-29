import { Injectable } from '@nestjs/common';
import { UserRepo } from '../repos/user.repo';
import { CreateUserArg } from '../models/user.model';
import { UserCredentialRepo } from '../repos/user-credential.repo';
import { Crypto } from '../../../utils/crypto/crypto';
import {
  UserStatus,
  UserType,
} from '../../../utils/prisma/generated/user-identity-db-client-types';
import { PublicException } from '../../../utils/exception/public-exception';
import { PublicErrorCode } from '../../../utils/exception/public-error-code.enum';
import config from '../../../config';

@Injectable()
export class AccountService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly userCredentialRepo: UserCredentialRepo
  ) {}

  async login(
    tenantId: string,
    userType: UserType,
    username: string,
    password: string
  ) {
    const user = await this.userRepo.findOne(tenantId, username);
    if (!user) {
      throw new PublicException(PublicErrorCode.InvalidLoginPw); // User not found
    }
    if (user.type !== userType) {
      throw new PublicException(PublicErrorCode.InvalidLoginPw); // User type mismatch
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new PublicException(PublicErrorCode.AccountIsLocked);
    }

    // get user credentials
    const userCredential = await this.userCredentialRepo.findOneById(user.id);
    if (!userCredential) {
      throw new PublicException(PublicErrorCode.InvalidLoginPw); // User credentials not found
    }

    // Validate password
    const isPasswordValid = await Crypto.comparePassword(
      password,
      userCredential.passwordHash
    );

    if (!isPasswordValid) {
      if (
        userCredential.accessFailedCount + 1 >=
        config.MAX_ACCESS_FAILED_COUNT
      )
        await this.userRepo.lock(user.id);

      await this.userCredentialRepo.addAccessFailedCount(user.id);

      throw new PublicException(PublicErrorCode.InvalidLoginPw);
    }

    // Reset access failed count on successful login
    await this.userCredentialRepo.resetAccessFailedCount(user.id);

    return user;
  }

  async create(arg: CreateUserArg, pw: string) {
    // Check if username already exists
    const existingUser = await this.userRepo.findOne(
      arg.tenantId,
      arg.username
    );
    if (existingUser) {
      throw new PublicException(PublicErrorCode.UsernameExist);
    }

    // create user
    const user = await this.userRepo.create(arg);

    await this.userCredentialRepo.create(user.id, pw);
    return user;
  }
}
