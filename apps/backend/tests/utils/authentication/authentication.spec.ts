import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../../src/utils/authentication/jwt-auth.guard';
import { Public } from '../../../src/utils/authentication/public.decorator';
import { RequestMeta } from '../../../src/utils/authentication/request-meta.decorator';
import { UserResolverService } from '../../../src/utils/authentication/user-resolver.service';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(AuthGuard).toBeDefined();
  });
});

describe('Public decorator', () => {
  it('should be a function', () => {
    expect(typeof Public).toBe('function');
  });
});

describe('RequestMeta decorator', () => {
  it('should be a function', () => {
    expect(typeof RequestMeta).toBe('function');
  });
});

describe('UserResolverService', () => {
  let service: UserResolverService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolverService],
    }).compile();
    service = await module.resolve(UserResolverService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
