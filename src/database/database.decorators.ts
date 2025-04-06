import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DATABASE_CONFIG } from '../config/database.config';

export const InjectSupabase = () => createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[DATABASE_CONFIG];
  },
); 