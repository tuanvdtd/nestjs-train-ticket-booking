import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TestMiddlewareMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('1.TestMiddlewareMiddleware is running');
    next();
    console.log('.Middleware chạy xong rồi nè');
  }
}
