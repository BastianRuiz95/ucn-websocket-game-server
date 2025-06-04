import { IsString, IsUUID } from 'class-validator';

export class SendPrivateMessageDto {
  @IsUUID()
  id: string;

  @IsString()
  message: string;
}
