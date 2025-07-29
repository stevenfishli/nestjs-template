import { Test, TestingModule } from '@nestjs/testing';
import { FE_AccountController } from '../../../../../src/modules/user.identity/controllers/fe/account.controller';
import { AccountService } from '../../../../../src/modules/user.identity/services/account.service';
import { MemberService } from '../../../../../src/modules/user.identity/services/member.service';
import { WalletManager } from '../../../../../src/modules/user.wallet/managers/wallet.manager';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, RegisterRequest } from '../../../../../src/modules/user.identity/dtos/fe/account.dto';
import { UserType } from '../../../../../src/utils/prisma/generated/user-identity-db-client-types';
import { PublicException } from '../../../../../src/utils/exception/public-exception';
import { PublicErrorCode } from '../../../../../src/utils/exception/public-error-code.enum';

describe('FE_AccountController', () => {
  let controller: FE_AccountController;
  let accountService: jest.Mocked<AccountService>;
  let memberService: jest.Mocked<MemberService>;
  let walletManager: jest.Mocked<WalletManager>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FE_AccountController],
      providers: [
        { provide: AccountService, useValue: { login: jest.fn() } },
        { provide: MemberService, useValue: { create: jest.fn() } },
        { provide: WalletManager, useValue: { create: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get(FE_AccountController);
    accountService = module.get(AccountService);
    memberService = module.get(MemberService);
    walletManager = module.get(WalletManager);
    jwtService = module.get(JwtService);
  });

  describe('login', () => {
    it('should return accessToken on success', async () => {
      const meta = { tenantId: 'tid' } as any;
      const req: LoginRequest = { username: 'u', password: 'p' } as any;
      const user = { id: 'uid', username: 'u', type: UserType.MEMBER };
      accountService.login.mockResolvedValue(user as any);
      jwtService.signAsync.mockResolvedValue('jwt-token');
      const result = await controller.login(meta, req);
      expect(result).toEqual({ accessToken: 'jwt-token' });
      expect(accountService.login).toBeCalledWith('tid', UserType.MEMBER, 'u', 'p');
    });
    it('should throw if tenantId missing', async () => {
      await expect(controller.login({} as any, { username: 'u', password: 'p' } as any)).rejects.toThrow('tenantId is required');
    });
    it('should propagate service error', async () => {
      accountService.login.mockRejectedValue(new PublicException(PublicErrorCode.InvalidLoginPw));
      await expect(controller.login({ tenantId: 'tid' } as any, { username: 'u', password: 'p' } as any)).rejects.toThrow(PublicException);
    });
  });

  describe('register', () => {
    it('should create user, wallet, and return accessToken', async () => {
      const meta = { tenantId: 'tid' } as any;
      const req: RegisterRequest = { username: 'u', pw: 'pw', email: 'e', phonePrefix: '+886', phone: '912345678', dob: '2000-01-01', currencies: ['TWD'] } as any;
      const user = { id: 'uid', username: 'u', type: UserType.MEMBER };
      memberService.create.mockResolvedValue(user as any);
      walletManager.create.mockResolvedValue(undefined);
      jwtService.signAsync.mockResolvedValue('jwt-token');
      const result = await controller.register(meta, req);
      expect(memberService.create).toBeCalledWith(expect.objectContaining({ username: 'u', tenantId: 'tid' }), 'pw');
      expect(walletManager.create).toBeCalledWith('tid', 'uid', ['TWD']);
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });
    it('should throw if tenantId missing', async () => {
      await expect(controller.register({} as any, {} as any)).rejects.toThrow('tenantId is required');
    });
    it('should propagate service error', async () => {
      memberService.create.mockRejectedValue(new PublicException(PublicErrorCode.UsernameExist));
      await expect(controller.register({ tenantId: 'tid' } as any, {} as any)).rejects.toThrow(PublicException);
    });
  });
});
