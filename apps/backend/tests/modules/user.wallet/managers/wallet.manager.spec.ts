import { Test, TestingModule } from '@nestjs/testing';
import { WalletManager } from '../../../../src/modules/user.wallet/managers/wallet.manager';
import { WalletService } from '../../../../src/modules/user.wallet/services/wallet.service';

describe('WalletManager', () => {
  let manager: WalletManager;
  let walletService: jest.Mocked<WalletService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletManager,
        { provide: WalletService, useValue: { create: jest.fn() } },
      ],
    }).compile();
    manager = module.get(WalletManager);
    walletService = module.get(WalletService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call walletService.create with correct args', async () => {
    walletService.create.mockResolvedValue(undefined);
    await expect(manager.create('tid', 'uid', ['TWD'])).resolves.toBeUndefined();
    expect(walletService.create).toBeCalledWith('tid', 'uid', ['TWD']);
  });
});
