import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PredictionDocument } from './entities/prediction.entity';
import { ConfigService } from '@nestjs/config';
import * as tf from '@tensorflow/tfjs-node';
import { PredictionEnum, PredictionSuggestionEnum } from './prediction.enum';
import { v4 as UUIDV4 } from 'uuid';
import { CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class PredictionService {
  constructor(
    @Inject(PredictionDocument.collectionName)
    private predictionCollection: CollectionReference<PredictionDocument>,
    private readonly configService: ConfigService,
  ) { }

  async predict(file: Express.Multer.File): Promise<PredictionDocument> {
    const model = await tf.loadGraphModel(this.configService.get('MODEL_URL'));

    let tensor: tf.Tensor;
    let prediction: tf.Tensor | tf.Tensor[] | tf.NamedTensorMap;
    try {
      tensor = tf.node
        .decodeJpeg(file.buffer)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      prediction = model.predict(tensor);
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }


    if (prediction instanceof tf.Tensor) {
      const score = await prediction.data();
      const confidenceScore = Math.max(...score) * 100;

      const predictionDocument = new PredictionDocument();
      predictionDocument.id = UUIDV4().toString();
      predictionDocument.result =
        confidenceScore > 50
          ? PredictionEnum.CANCER
          : PredictionEnum.NON_CANCER;
      predictionDocument.suggestion =
        confidenceScore > 50
          ? PredictionSuggestionEnum.CONSULT_DOCTOR
          : PredictionSuggestionEnum.FINE;
      const responsePredictionEntity = predictionDocument;
      predictionDocument.createdAt = new Date(Date.now()).toISOString();

      try {
        await this.predictionCollection.doc(predictionDocument.id).set(predictionDocument.toObject());
      } catch (error) {
        throw new HttpException(error, 500);
      }

      return responsePredictionEntity;
    } else {
      throw new HttpException(
        'Terjadi kesalahan dalam melakukan prediksi',
        500,
      );
    }
  }

  async findAll(): Promise<PredictionDocument[]> {
    const snapshot = await this.predictionCollection.get();
    const predictions: PredictionDocument[] = [];

    snapshot.forEach((doc) => {
      predictions.push(doc.data());
    });

    return predictions;
  }
}
