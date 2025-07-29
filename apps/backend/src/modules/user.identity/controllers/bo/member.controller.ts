import { Controller, Get, Query } from '@nestjs/common';
import { MemberService } from '../../services/member.service';
import { FindMemberListRequest, MemberListDto } from '../../dtos/bo/member.dto';

@Controller('api/bo/member')
export class BO_MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async find(@Query() query: FindMemberListRequest): Promise<MemberListDto> {
    if (query.username?.length) {
      const users = await this.memberService.findStartWithValue(query.username);
      if (!users) {
        return { items: [] };
      }

      const response: MemberListDto = {
        items: users.map((user) => ({
          id: user.id,
          updatedOn: user.updatedOn,
          username: user.username,
        })),
      };
      return response;
    } else if (query.startOn || query.endOn) {
      // TODO: find users by date range

      return { items: [] }; // Placeholder for date range logic
    } else {
      return { items: [] }; // No filters applied
    }
  }
}
