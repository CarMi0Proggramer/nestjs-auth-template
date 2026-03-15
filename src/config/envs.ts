import dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : undefined,
  quiet: true,
});

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRE_IN: string;
  REFRESH_JWT_SECRET: string;
  REFRESH_JWT_EXPIRE_IN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRE_IN: joi.string().required(),
    REFRESH_JWT_SECRET: joi.string().required(),
    REFRESH_JWT_EXPIRE_IN: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),
    FRONTEND_URL: joi.string().required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Environment variables validation error: ${error}`);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpireIn: envVars.JWT_EXPIRE_IN,
  refreshJwtSecret: envVars.REFRESH_JWT_SECRET,
  refreshJwtExpireIn: envVars.REFRESH_JWT_EXPIRE_IN,
  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleSecret: envVars.GOOGLE_SECRET,
  googleCallbackUrl: envVars.GOOGLE_CALLBACK_URL,
  frontendUrl: envVars.FRONTEND_URL,
};
