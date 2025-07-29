import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestMeta {
  tenantId?: string;
  acceptLanguage?: string;
  domainFrom?: string;
  device?: string;
}

export function requestMetaFactory(
  data: unknown,
  ctx: ExecutionContext
): RequestMeta {
  const req = ctx.switchToHttp().getRequest();
  return {
    tenantId: req.headers['x-api-key'],
    acceptLanguage: req.headers['accept-language'],
    // domainFrom: req.headers['x-domain-from'],
    device: req.headers['device'],
  };
}

export const RequestMeta = createParamDecorator(requestMetaFactory);
