import { Global, Module } from '@nestjs/common';
import { UserResolverService } from './user-resolver.service';

@Global()
@Module({
  providers: [UserResolverService],
  exports: [UserResolverService],
})
export class UserResolverModule {}
