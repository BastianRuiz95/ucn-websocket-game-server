import { SubscribeMessage } from '@nestjs/websockets';
import { applyDecorators, UseFilters, UseInterceptors } from '@nestjs/common';

import { WsGameExceptionFilter } from '../filters';
import { WsParseResultInterceptor } from '../interceptors';

export function WsEventListener(event: string) {
  return applyDecorators(
    UseFilters(new WsGameExceptionFilter(event)),
    UseInterceptors(new WsParseResultInterceptor(event)),
    SubscribeMessage(event),
  );
}
