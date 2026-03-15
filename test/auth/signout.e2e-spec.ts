import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';

describe('AuthController (e2e) - SignOut', () => {
  const testUser = {
    name: 'Test User',
    email: 'signout@gmail.com',
    password: 'password123',
  };
  let app: INestApplication<App>;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await userRepository.delete({ email: testUser.email });
    const signUpRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser);

    accessToken = signUpRes.body.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should sign out user successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Sign out realizado com sucesso!',
    });
  });

  it('should return status 401 if no token is provided', async () => {
    const res = await request(app.getHttpServer()).post('/auth/signout');
    expect(res.status).toBe(401);
  });
});
