import { registerAs } from '@nestjs/config';
import validateConfig from '.././utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUrl,
  Max,
  Min,
} from '@nestjs/class-validator';

export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  modelUrl: string;
  port: number;
};

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  MODEL_URL: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    modelUrl: process.env.MODEL_URL,
  };
});
