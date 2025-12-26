import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from 'src/config/envs';
import { join } from 'node:path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envs.databaseUrl,
      migrations: [join(__dirname, 'migrations/**/*.{ts,js}')],
      entities: [join(__dirname, 'entities/**/*.{ts,js}')],
    }),
  ],
})
export class DatabaseModule {}
