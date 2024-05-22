import { FileValidator, HttpException, HttpStatus } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export type MaxFileSizeValidatorOptions = {
  maxSize: number;
  message?: string | ((maxSize: number) => string);
};

export class CustomMaxFileSizeValidator extends FileValidator<
  MaxFileSizeValidatorOptions,
  IFile
> {
  constructor(private readonly options: { maxSize: number; message: string }) {
    super(options);
  }

  isValid(
    file?: IFile | IFile[] | Record<string, IFile[]>,
  ): boolean | Promise<boolean> {
    if (file instanceof Array) {
      for (const f of file) {
        if (!this.validate(f)) {
          return false;
        }
      }

      return true;
    }

    return this.validate(file);
  }

  validate(file: IFile | Record<string, IFile[]>): boolean {
    if (file instanceof Array) {
      for (const f of file) {
        if (f.size > this.options.maxSize) {
          throw new HttpException(
            this.buildErrorMessage(f),
            HttpStatus.PAYLOAD_TOO_LARGE,
          ); // Replace YOUR_CUSTOM_STATUS_CODE with the status code you want
        }
      }

      return true;
    } else {
      const f = file as IFile;
      if (f.size > this.options.maxSize) {
        throw new HttpException(
          this.buildErrorMessage(f),
          HttpStatus.PAYLOAD_TOO_LARGE,
        ); // Replace YOUR_CUSTOM_STATUS_CODE with the status code you want
      }
    }

    return true;
  }

  buildErrorMessage(file: any): string {
    return this.options.message && file
      ? this.options.message
      : 'File is too large';
  }
}
