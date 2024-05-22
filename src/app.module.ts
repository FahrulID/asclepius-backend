import { Module } from '@nestjs/common';
import { PredictionModule } from './prediction/prediction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import firestoreConfig from './config/firestore-config.type';
import appConfig from './config/app-config.type';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FirestoreModule } from './firestore/firestore.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, firestoreConfig],
      envFilePath: ['.env'],
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        projectId: configService.get('firestore.firestoreProjectID', {
          infer: true,
        }),
        credentials: {
          client_email: configService.get('firestore.firestoreClientEmail', {
            infer: true,
          }),
          private_key: configService.get('firestore.firestorePrivateKey', {
            infer: true,
          }),
        },
        databaseId: configService.get('firestore.firestoreDatabaseID', {
          infer: true,
        }),
      }),
      inject: [ConfigService],
    }),
    PredictionModule,
    FirestoreModule,
  ],
})
export class AppModule {}
