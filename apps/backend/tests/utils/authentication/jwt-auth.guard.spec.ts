import { AuthGuard, JwtPayload } from '../../../src/utils/authentication/jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

const mockReflector = () => ({
  getAllAndOverride: jest.fn(),
});
const mockJwtService = () => ({
  verifyAsync: jest.fn(),
});

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: ReturnType<typeof mockJwtService>;
  let reflector: ReturnType<typeof mockReflector>;

  beforeEach(() => {
    jwtService = mockJwtService();
    reflector = mockReflector();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    guard = new AuthGuard(jwtService as any, reflector as any);
  });

  function mockContext({
    authorization,
    isPublic = false,
  }: { authorization?: string; isPublic?: boolean }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req: any = { headers: {} };
    if (authorization) req.headers.authorization = authorization;
    const context = {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
    reflector.getAllAndOverride.mockReturnValue(isPublic);
    return { context, req };
  }

  it('should return true if route is public', async () => {
    const { context } = mockContext({ isPublic: true });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should throw UnauthorizedException if no token', async () => {
    const { context } = mockContext({});
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token invalid', async () => {
    const { context } = mockContext({ authorization: 'Bearer badtoken' });
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should set request.user and return true if token valid', async () => {
    const payload: JwtPayload = { sub: 'u1', username: 'u', userType: 'MEMBER', tenantId: 't', iat: 1, exp: 2 };
    const { context, req } = mockContext({ authorization: 'Bearer goodtoken' });
    jwtService.verifyAsync.mockResolvedValue(payload);
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req.user).toEqual(payload);
  });

  describe('extractTokenFromHeader', () => {
    it('should extract Bearer token', () => {
      const req = { headers: { authorization: 'Bearer token123' } };
      // @ts-expect-error: test private method
      expect(guard.extractTokenFromHeader(req)).toBe('token123');
    });
    it('should return undefined for non-Bearer', () => {
      const req = { headers: { authorization: 'Basic abc' } };
      // @ts-expect-error: test private method
      expect(guard.extractTokenFromHeader(req)).toBeUndefined();
    });
    it('should return undefined if no header', () => {
      const req = { headers: {} };
      // @ts-expect-error: test private method
      expect(guard.extractTokenFromHeader(req)).toBeUndefined();
    });
  });
});
