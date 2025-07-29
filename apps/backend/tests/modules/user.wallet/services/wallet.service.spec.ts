import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../../../../src/modules/user.wallet/services/wallet.service';
import { WalletRepo } from '../../../../src/modules/user.wallet/repos/wallet.repo';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepo: jest.Mocked<WalletRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: WalletRepo, useValue: { create: jest.fn() } },
      ],
    }).compile();
    service = module.get(WalletService);
    walletRepo = module.get(WalletRepo);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call walletRepo.create with correct args', async () => {
    walletRepo.create.mockResolvedValue(undefined);
    await expect(service.create('tid', 'uid', ['TWD'])).resolves.toBeUndefined();
    expect(walletRepo.create).toHaveBeenCalledWith('tid', 'uid', ['TWD']);
  });

  it('should call walletRepo.findByUserId with correct args', async () => {
    walletRepo.findByUserId = jest.fn().mockResolvedValue({ id: 'w1' });
    await expect(service.findByUserId('uid')).resolves.toEqual({ id: 'w1' });
    expect(walletRepo.findByUserId).toHaveBeenCalledWith('uid');
  });
});
