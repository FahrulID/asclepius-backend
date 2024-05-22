import {
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  ParseFilePipe,
  Post,
  Request,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  BaseController,
  HttpResponse,
} from '../utils/basecontroller.controller';
import { HttpExceptionFilter } from '../utils/exception.filter';
import { CustomMaxFileSizeValidator } from '../utils/max-filesize.validator';
import { PredictionDocument } from './entities/prediction.entity';

@Controller('predict')
export class PredictionController extends BaseController {
  constructor(private readonly predictionService: PredictionService) {
    super();
  }

  @Post()
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(FileInterceptor('image'))
  async predict(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new CustomMaxFileSizeValidator({
            maxSize: 1000000,
            message:
              'Payload content length greater than maximum allowed: 1000000',
          }), // 1MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
    @Res() res,
  ): Promise<HttpResponse<PredictionDocument>> {
    try {
      if (!image) {
        throw new HttpException(
          'Terjadi kesalahan dalam melakukan prediksi',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = this.responseSuccess(
        'Model is predicted successfully',
        await this.predictionService.predict(image),
      );

      res.status(HttpStatus.CREATED).json(response);

      return response;
    } catch (error) {
      if (!(error instanceof HttpException))
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

      throw error;
    }
  }

  @Get('histories')
  async findAll(): Promise<HttpResponse<PredictionDocument[]>> {
    return this.responseSuccess(
      'Histories are fetched successfully',
      await this.predictionService.findAll(),
    );
  }
}
