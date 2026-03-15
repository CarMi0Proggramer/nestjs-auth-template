import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { envs } from '@/config/envs';

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
