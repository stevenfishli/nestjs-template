import { Body, Controller, Post } from '@nestjs/common';
import { MemberService } from '../../services/member.service';
import { WalletManager } from '../../../user.wallet/managers/wallet.manager';
import {
  LoginRequest,
  RegisterRequest,
  AuthTokenResponse,
} from '../../dtos/fe/account.dto';
import { UserType } from '../../../../utils/prisma/generated/user-identity-db-client-types';
import { RequestMeta } from '../../../../utils/authentication/request-meta.decorator';
import { Public } from '../../../../utils/authentication/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../../services/account.service';
import { generateJwtPayload } from '../../../../utils/authentication/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorDto } from '../../../../utils/exception/error.dto';
import { CreateMemberArg } from '../../models/member.model';

@ApiTags('frontend')
@Controller('api/fe/account')
export class FE_AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly memberService: MemberService,
    private readonly walletManager: WalletManager,
    private readonly jwtService: JwtService
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Member login' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: 200,
    description: '登入成功',
    type: AuthTokenResponse,
  })
  @ApiResponse({
    status: 400,
    description: '帳號或密碼錯誤、帳號鎖定等業務邏輯錯誤',
    type: ErrorDto,
  })
  @ApiResponse({ status: 500, description: '伺服器內部錯誤', type: ErrorDto })
  async login(
    @RequestMeta() meta: RequestMeta,
    @Body() request: LoginRequest
  ): Promise<AuthTokenResponse> {
    // login
    const user = await this.accountService.login(
      meta.tenantId ??
        (() => {
          throw new Error('tenantId is required');
        })(),
      UserType.MEMBER,
      request.username,
      request.pw
    );

    // Create JWT payload
    const accessToken = await this.jwtService.signAsync(
      generateJwtPayload(user.id, user.username, user.type, meta.tenantId)
    );
    return { accessToken };
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Member registration' })
  @ApiBody({ type: RegisterRequest })
  @ApiResponse({
    status: 200,
    description: '註冊成功',
    type: AuthTokenResponse,
  })
  @ApiResponse({
    status: 400,
    description: '註冊資料不合法、帳號已存在等業務邏輯錯誤',
    type: ErrorDto,
  })
  @ApiResponse({ status: 500, description: '伺服器內部錯誤', type: ErrorDto })
  async register(
    @RequestMeta() meta: RequestMeta,
    @Body() request: RegisterRequest
  ): Promise<AuthTokenResponse> {
    // create user
    const tenantId =
      meta.tenantId ??
      (() => {
        throw new Error('tenantId is required');
      })();

    const arg: CreateMemberArg = {
      tenantId: tenantId,
      email: request.email,
      username: request.username,
      phonePrefix: request.phonePrefix,
      phone: request.phone,
      dob: request.dob,
      latestLoginOn: new Date(),
    };

    const user = await this.memberService.create(arg, request.pw);
    await this.walletManager.create(tenantId, user.id, request.currencies);

    // Create JWT payload
    const accessToken = await this.jwtService.signAsync(
      generateJwtPayload(user.id, user.username, user.type, meta.tenantId)
    );
    return { accessToken };
  }
}
