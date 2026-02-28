import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class TestErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const res: Response = host.switchToHttp().getResponse();
    res.status(400).json({
      code: 400,
      message: exception.message,
    });
  }
}
