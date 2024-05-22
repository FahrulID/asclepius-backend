export class PredictionDocument {
  static collectionName = 'predictions';

  id: string;
  result: string;
  suggestion: string;
  createdAt: string;

  toObject(): any {
    return {
      id: this.id,
      result: this.result,
      suggestion: this.suggestion,
      createdAt: this.createdAt,
    };
  }
}
