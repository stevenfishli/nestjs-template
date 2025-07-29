import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class FindMemberListRequest {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsDate()
  @IsOptional()
  readonly startOn?: Date;

  @IsDate()
  @IsOptional()
  readonly endOn?: Date;
}

export class MemberListDto {
  @IsArray()
  readonly items!: MemberDto[];
}

class MemberDto {
  @IsString()
  readonly id!: string;

  @IsDate()
  readonly updatedOn!: Date;

  @IsString()
  readonly username!: string;
}
