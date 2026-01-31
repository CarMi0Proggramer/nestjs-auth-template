import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRE_IN: string;
  REFRESH_JWT_SECRET: string;
  REFRESH_JWT_EXPIRE_IN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRE_IN: joi.string().required(),
    REFRESH_JWT_SECRET: joi.string().required(),
    REFRESH_JWT_EXPIRE_IN: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Environment variables validation error: ${error}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpireIn: envVars.JWT_EXPIRE_IN,
  refreshJwtSecret: envVars.REFRESH_JWT_SECRET,
  refreshJwtExpireIn: envVars.REFRESH_JWT_EXPIRE_IN,
};
