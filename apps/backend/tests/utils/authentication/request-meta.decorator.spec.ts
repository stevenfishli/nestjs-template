import { requestMetaFactory } from '../../../src/utils/authentication/request-meta.decorator';
import { ExecutionContext } from '@nestjs/common';

describe('RequestMeta Decorator', () => {
  const createMockContext = (headers: Record<string, string | undefined>): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
    } as any;
  };

  it('should extract tenantId, acceptLanguage, and device from headers', () => {
    const headers = {
      'x-api-key': 'tenant-123',
      'accept-language': 'zh-TW',
      'device': 'ios',
    };
    const ctx = createMockContext(headers);
    const result = requestMetaFactory(undefined, ctx);
    expect(result).toEqual({
      tenantId: 'tenant-123',
      acceptLanguage: 'zh-TW',
      device: 'ios',
    });
  });

  it('should return undefined for missing headers', () => {
    const headers = {};
    const ctx = createMockContext(headers);
    const result = requestMetaFactory(undefined, ctx);
    expect(result).toEqual({
      tenantId: undefined,
      acceptLanguage: undefined,
      device: undefined,
    });
  });

  it('should handle partial headers', () => {
    const headers = {
      'x-api-key': 'tenant-abc',
    };
    const ctx = createMockContext(headers);
    const result = requestMetaFactory(undefined, ctx);
    expect(result).toEqual({
      tenantId: 'tenant-abc',
      acceptLanguage: undefined,
      device: undefined,
    });
  });
});
