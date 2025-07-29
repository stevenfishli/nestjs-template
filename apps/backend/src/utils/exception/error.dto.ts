import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({ example: 'Bad Request', description: '錯誤訊息' })
  message?: string;

  @ApiProperty({ example: 'VALIDATION_ERROR', description: '錯誤代碼', required: false })
  errorCode?: string;
}
