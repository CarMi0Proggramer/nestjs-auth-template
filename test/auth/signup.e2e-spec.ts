import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';

describe('AuthController (e2e) - SignUp', () => {
  const testUser = {
    name: 'Test User',
    email: 'signup@gmail.com',
    password: 'password123',
  };
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.delete({ email: testUser.email });
  });

  afterEach(async () => {
    await app.close();
  });

  it('should sign up user successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should return status 400 with no body', async () => {
    const res = await request(app.getHttpServer()).post('/auth/signup');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: [
        'name must be a string',
        'name should not be empty',
        'email must be a string',
        'email must be an email',
        'password must be a string',
        'password must be longer than or equal to 6 characters',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('should return status 401 if user with email exists', async () => {
    const signUp = () => {
      return request(app.getHttpServer()).post('/auth/signup').send(testUser);
    };

    await signUp();
    const res = await signUp();

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'User already exists.',
      statusCode: 401,
    });
  });
});
