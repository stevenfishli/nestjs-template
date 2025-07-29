import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../../../../src/modules/user.identity/services/account.service';
import { UserRepo } from '../../../../src/modules/user.identity/repos/user.repo';
import { UserCredentialRepo } from '../../../../src/modules/user.identity/repos/user-credential.repo';
import { PublicException } from '../../../../src/utils/exception/public-exception';
import { User, UserCredential, UserDevice, UserStatus, UserType } from '../../../../src/utils/prisma/generated/user-identity-db-client-types';
import { Crypto } from '../../../../src/utils/crypto/crypto';

jest.mock('../../../../src/utils/crypto/crypto');

describe('AccountService', () => {
  let service: AccountService;
  let userRepo: jest.Mocked<UserRepo>;
  let userCredentialRepo: jest.Mocked<UserCredentialRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: UserRepo, useValue: { findOne: jest.fn(), lock: jest.fn(), create: jest.fn() } },
        { provide: UserCredentialRepo, useValue: { findOneById: jest.fn(), addAccessFailedCount: jest.fn(), resetAccessFailedCount: jest.fn(), create: jest.fn() } },
      ],
    }).compile();

    service = module.get(AccountService);
    userRepo = module.get(UserRepo);
    userCredentialRepo = module.get(UserCredentialRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const tenantId = 'tenant1';
    const username = 'user1';
    const password = 'pw';
    const userType = UserType.MEMBER;
    const user: User = {
      id: 'u1',
      type: userType,
      status: UserStatus.ACTIVE,
      createdOn: new Date(),
      createdBy: null,
      updatedOn: new Date(),
      updatedBy: null,
      tenantId: 'tenant1',
      username: 'user1',
      nickname: null,
      phonePrefix: '',
      phone: '',
      email: '',
      emailConfirmed: false,
      phoneConfirmed: false,
      latestLoginOn: null,
      latestLoginIp: null,
      deviceSrc: UserDevice.WINDOWS,
      agentId: null,
      srcFrom: null,
      ipFrom: null,
      realName: null,
      isValid: true,
      dob: null,
      isPersonalInfoCompleted: false,
    };
    const userCredential: UserCredential = {
      userId: user.id,
      passwordHash: 'hash',
      withdrawalPasswordHash: null,
      accessFailedCount: 0,
      createdOn: new Date(),
      createdBy: null,
      updatedOn: new Date(),
      updatedBy: null,
    };

    it('should throw if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.login(tenantId, userType, username, password)).rejects.toThrow(PublicException);
    });

    it('should throw if user type mismatch', async () => {
      userRepo.findOne.mockResolvedValue({ ...user, type: UserType.BO_ADMIN });
      await expect(service.login(tenantId, userType, username, password)).rejects.toThrow(PublicException);
    });

    it('should throw if user is not active', async () => {
      userRepo.findOne.mockResolvedValue({ ...user, status: UserStatus.LOCKED });
      await expect(service.login(tenantId, userType, username, password)).rejects.toThrow(PublicException);
    });

    it('should throw if userCredential not found', async () => {
      userRepo.findOne.mockResolvedValue(user);
      userCredentialRepo.findOneById.mockResolvedValue(null);
      await expect(service.login(tenantId, userType, username, password)).rejects.toThrow(PublicException);
    });

    it('should throw if password invalid', async () => {
      userRepo.findOne.mockResolvedValue(user);
      userCredentialRepo.findOneById.mockResolvedValue(userCredential);
      (Crypto.comparePassword as jest.Mock).mockResolvedValue(false);
      await expect(service.login(tenantId, userType, username, password)).rejects.toThrow(PublicException);
    });

    it('should return user if login success', async () => {
      userRepo.findOne.mockResolvedValue(user);
      userCredentialRepo.findOneById.mockResolvedValue(userCredential);
      (Crypto.comparePassword as jest.Mock).mockResolvedValue(true);
      userCredentialRepo.resetAccessFailedCount.mockResolvedValue(undefined);
      await expect(service.login(tenantId, userType, username, password)).resolves.toEqual(user);
    });
  });

  describe('create', () => {
    it('should throw if username already exists', async () => {
      const arg = { username: 'u', tenantId: 't' } as any;
      userRepo.findOne.mockResolvedValue({ id: 'existing' } as any);
      await expect(service.create(arg, 'pw')).rejects.toThrow(PublicException);
    });
    it('should create user, player, and credential', async () => {
      const arg = { username: 'u', tenantId: 't' } as any;
      userRepo.findOne.mockResolvedValue(null);
      const user: User = {
        id: 'u1',
        type: UserType.MEMBER,
        status: UserStatus.ACTIVE,
        createdOn: new Date(),
        createdBy: null,
        updatedOn: new Date(),
        updatedBy: null,
        tenantId: 'tenant1',
        username: 'user1',
        nickname: null,
        phonePrefix: '',
        phone: '',
        email: '',
        emailConfirmed: false,
        phoneConfirmed: false,
        latestLoginOn: null,
        latestLoginIp: null,
        deviceSrc: UserDevice.WINDOWS,
        agentId: null,
        srcFrom: null,
        ipFrom: null,
        realName: null,
        isValid: true,
        dob: null,
        isPersonalInfoCompleted: false,
      };
      userRepo.create.mockResolvedValue(user);
      userCredentialRepo.create.mockResolvedValue(undefined);
      await expect(service.create(arg, 'pw')).resolves.toEqual(user);
      expect(userRepo.create).toHaveBeenCalledWith(arg);
      expect(userCredentialRepo.create).toHaveBeenCalledWith(user.id, 'pw');
    });
  });
});
