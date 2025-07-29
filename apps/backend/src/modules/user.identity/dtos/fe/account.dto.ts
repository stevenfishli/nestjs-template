import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Currency } from '../../../../utils/prisma/generated/user-wallet-db-client-types';

export class LoginRequest {
  @ApiProperty({ description: '使用者名稱', example: 'testuser' })
  @IsString()
  username!: string;

  @ApiProperty({ description: '密碼', example: '123456' })
  @IsString()
  pw!: string;
}

export class RegisterRequest {
  @ApiProperty({ description: '使用者名稱', example: 'testuser' })
  @IsString()
  username!: string;

  @ApiProperty({
    description: '電子郵件',
    example: 'test@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '密碼', example: '123456' })
  @IsString()
  pw!: string;

  @ApiProperty({
    enum: Currency,
    description: '註冊幣別清單',
    example: ['TWD', 'USD'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsEnum(Currency, { each: true })
  currencies!: Currency[];

  @ApiProperty({ description: '驗證碼', example: '123456', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: '網域', example: 'example.com', required: false })
  @IsString()
  @IsOptional()
  domain?: string;

  @ApiProperty({ description: '手機區碼', example: '+886', required: false })
  @IsOptional()
  @IsString()
  phonePrefix?: string;

  @ApiProperty({
    description: '手機號碼',
    example: '912345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: '生日',
    example: '1990-01-01',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @ApiProperty({
    description: '手機驗證碼',
    example: '654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneVerificationCode?: string;
}

export class AuthTokenResponse {
  @ApiProperty({ description: 'JWT access token', example: 'jwt-token' })
  accessToken!: string;
}
