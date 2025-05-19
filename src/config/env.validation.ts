import {
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { plainToInstance, Expose } from 'class-transformer';

const Environment = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const;

type Environment = (typeof Environment)[keyof typeof Environment];

class EnvironmentVariables {
  @Expose()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Expose()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @Expose()
  @IsString()
  @IsUrl({ require_tld: false })
  API_URL: string;

  // Database Configuration
  @Expose()
  @IsString()
  DATABASE_HOST: string;

  @Expose()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @Expose()
  @IsString()
  DATABASE_USERNAME: string;

  @Expose()
  @IsString()
  DATABASE_PASSWORD: string;

  @Expose()
  @IsString()
  DATABASE_NAME: string;

  @Expose()
  @IsString()
  WEATHERAPI_API_KEY: string;

  @Expose()
  @IsString()
  MAIL_FROM: string;

  @Expose()
  @IsString()
  GOOGLE_APP_PASSWORD: string;

  @Expose()
  @IsString()
  GOOGLE_APP_USER: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
