import { AppConfig } from './app-config.type';
import { FirestoreConfig } from './firestore-config.type';

export type AllConfigType = {
  app: AppConfig;
  firestore: FirestoreConfig;
};
