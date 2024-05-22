import { registerAs } from '@nestjs/config';

import { IsString } from '@nestjs/class-validator';
import validateConfig from '../utils/validate-config';

export type FirestoreConfig = {
  firestoreSAKey: string;
  firestoreProjectID: string;
  firestoreClientEmail: string;
  firestorePrivateKey: string;
  firestoreDatabaseID?: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  FIRESTORE_SA_KEY: string;

  @IsString()
  FIRESTORE_PROJECTID: string;

  @IsString()
  FIRESTORE_CLIENT_EMAIL: string;

  @IsString()
  FIRESTORE_PRIVATE_KEY: string;

  @IsString()
  FIRESTORE_DATABASE_ID: string;
}

export default registerAs<FirestoreConfig>('firestore', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    firestoreSAKey: process.env.FIRESTORE_SA_KEY,
    firestoreProjectID: process.env.FIRESTORE_PROJECTID,
    firestoreClientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
    firestorePrivateKey: process.env.FIRESTORE_PRIVATE_KEY,
    firestoreDatabaseID: process.env.FIRESTORE_DATABASE_ID,
  };
});
