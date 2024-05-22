import { PredictionDocument } from '../prediction/entities/prediction.entity';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  PredictionDocument.collectionName,
];
