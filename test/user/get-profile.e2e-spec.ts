import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';

describe('UserController (e2e) - Profile', () => {
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

    await userRepository.delete({ email: 'test@example.com' });
    const signUpResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    accessToken = signUpResponse.body.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should get user profile', async () => {
    const profileResponse = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toMatchObject({
      email: 'test@example.com',
      name: 'Test User',
    });
  });
});
