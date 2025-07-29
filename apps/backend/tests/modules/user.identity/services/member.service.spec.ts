import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '../../../../src/modules/user.identity/services/member.service';
import { PublicException } from '../../../../src/utils/exception/public-exception';
import { PublicErrorCode } from '../../../../src/utils/exception/public-error-code.enum';
import { User, UserStatus, UserType } from '../../../../src/utils/prisma/generated/user-identity-db-client-types';
import { AccountService } from '../../../../src/modules/user.identity/services/account.service';
import { PlayerRepo } from '../../../../src/modules/user.identity/repos/player.repo';
import { UserRepo } from '../../../../src/modules/user.identity/repos/user.repo';

describe('MemberService', () => {
  let service: MemberService;
  let playerRepo: jest.Mocked<PlayerRepo>;
  let accountService: jest.Mocked<AccountService>;
  // let userRepo: jest.Mocked<UserRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: PlayerRepo, useValue: { create: jest.fn() } },
        { provide: UserRepo, useValue: { findStartWithValue: jest.fn() } },
        { provide: AccountService, useValue: { create: jest.fn() } },
      ],
    }).compile();
    service = module.get(MemberService);
    playerRepo = module.get(PlayerRepo);
    // userRepo = module.get(UserRepo);
    accountService = module.get(AccountService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create user with correct args', async () => {
    const arg = { username: 'u', tenantId: 't', email: 'e' };
    const user: User = { id: 'id', ...arg, type: UserType.MEMBER, status: UserStatus.ACTIVE } as User;
    accountService.create.mockResolvedValue(user);
    playerRepo.create.mockResolvedValue(undefined);
    const result = await service.create(arg, 'pw');
    expect(accountService.create).toBeCalledWith({ ...arg, type: UserType.MEMBER }, 'pw');
    expect(playerRepo.create).toBeCalledWith(user.id);
    expect(result).toBe(user);
  });

  it('should throw if accountService.create throws', async () => {
    accountService.create.mockRejectedValue(new PublicException(PublicErrorCode.UsernameExist, 'msg'));
    await expect(service.create({ username: 'u', tenantId: 't', email: 'e' }, 'pw')).rejects.toThrow(PublicException);
  });

  it('should throw if playerRepo.create throws', async () => {
    const arg = { username: 'u', tenantId: 't', email: 'e' };
    const user: User = { id: 'id', ...arg, type: UserType.MEMBER, status: UserStatus.ACTIVE } as User;
    accountService.create.mockResolvedValue(user);
    playerRepo.create.mockRejectedValue(new PublicException(PublicErrorCode.UsernameExist, 'msg'));
    await expect(service.create(arg, 'pw')).rejects.toThrow(PublicException);
  });
});
