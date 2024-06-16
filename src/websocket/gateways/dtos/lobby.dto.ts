import { IsString, IsUUID } from 'class-validator';

export class SendPublicMessageDto {
  @IsString()
  message: string;
}

export class SendPrivateMessageDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  message: string;
}
