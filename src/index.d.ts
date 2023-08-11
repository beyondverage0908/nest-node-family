import type { HttpStatus } from '@nestjs/common';

export declare interface HttpResult<T> {
  code: HttpStatus;
  success: boolean;
  message?: string;
  data?: T;
}
