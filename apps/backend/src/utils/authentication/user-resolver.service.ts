import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtPayload } from './jwt-auth.guard';

@Injectable({ scope: Scope.REQUEST })
export class UserResolverService {
  public readonly userId: string | null;

  constructor(@Inject(REQUEST) request?: { user?: JwtPayload }) {
    this.userId = request?.user?.sub ?? null;
  }
}
