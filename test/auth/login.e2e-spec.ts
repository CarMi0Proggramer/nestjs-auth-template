import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';
import { AuthProvider } from '../../src/common/enums/auth-provider.enum';

describe('AuthController (e2e) - Login', () => {
  const testUser = {
    name: 'Test User',
    email: 'login@gmail.com',
    password: 'password123',
  };
  const testOAuthUser = {
    name: 'Test Google User',
    email: 'oauth@google.com',
    password: null,
    authProvider: AuthProvider.GOOGLE,
  };
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await userRepository.delete({
      email: In([testUser.email, testOAuthUser.email]),
    });

    await request(app.getHttpServer()).post('/auth/signup').send(testUser);
    await userRepository.save(testOAuthUser);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should login user successfully', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should return 401 when email is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('should return 401 when password is missing', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email });

    expect(res.status).toBe(401);
  });

  it('should return 401 if user is not found', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'unregistered@gmail.com', password: '12345' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: 'Usuário não encontrado',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('should return 409 if user is registered with OAuth', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testOAuthUser.email, password: '12345' });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      message: 'Este e-mail já está cadastrado com Google.',
      error: 'Conflict',
      statusCode: 409,
    });
  });

  it("should return 400 if password doesn't match", async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: '12345' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Credenciais inválidas',
      error: 'Bad Request',
      statusCode: 400,
    });
  });
});
