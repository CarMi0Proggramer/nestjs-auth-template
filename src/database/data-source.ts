import { join } from 'node:path';
import { envs } from 'src/config/envs';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  url: envs.databaseUrl,
  migrations: [join(__dirname, 'migrations/**/*.{ts,js}')],
  entities: [join(__dirname, 'entities/**/*.{ts,js}')],
});
