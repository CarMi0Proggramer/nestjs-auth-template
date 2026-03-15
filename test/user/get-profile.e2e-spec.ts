import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';

describe('UserController (e2e) - Profile', () => {
  const testUser = {
    name: 'Test User',
    email: 'profile@gmail.com',
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
    const signUpResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser);

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
      email: testUser.email,
      name: testUser.name,
    });
  });
});
