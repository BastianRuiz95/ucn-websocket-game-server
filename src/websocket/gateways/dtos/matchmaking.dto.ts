import { IsUUID } from 'class-validator';

export class SendMatchRequestDto {
  @IsUUID()
  id: string;
}
