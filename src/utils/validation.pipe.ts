import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new HttpException(e.getResponse(), e.getStatus());
      }
    }
  }
}
