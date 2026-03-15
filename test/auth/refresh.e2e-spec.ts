import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await userRepository.delete({ email: 'test@example.com' });
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should refresh user tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    expect(res.body.accessToken).not.toBe(accessToken);
    expect(res.body.refreshToken).not.toBe(refreshToken);
  });

  it('should return status 401 if no token is provided', async () => {
    const res = await request(app.getHttpServer()).post('/auth/refresh');
    expect(res.status).toBe(401);
  });

  it('should return status 401 if refreshToken is invalid', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);

    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'Refresh token inválido',
      statusCode: 401,
    });
  });

  it("should return status 401 if user doesn't have a hashedRefreshToken", async () => {
    await userRepository.update(
      { email: 'test@example.com' },
      { hashedRefreshToken: null },
    );

    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'Refresh token inválido',
      statusCode: 401,
    });
  });
});
