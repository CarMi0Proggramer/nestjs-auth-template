import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';

describe('AuthController (e2e) - SignUp', () => {
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
    await userRepository.delete({ email: 'carlos@google.com' });
  });

  afterEach(async () => {
    await app.close();
  });

  it('should sign up user successfully', async () => {
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      name: 'Carlos Miguel',
      password: 'password123',
      email: 'carlos@google.com',
    });

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
        'O nome é obrigatório',
        'O nome não pode ser vazio',
        'O email é obrigatório',
        'O email deve ser válido',
        'A senha é obrigatória',
        'A senha deve ter no mínimo 6 caracteres',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('should return status 401 if user with email exists', async () => {
    const signUp = () =>
      request(app.getHttpServer()).post('/auth/signup').send({
        name: 'Carlos Miguel',
        password: 'password123',
        email: 'carlos@google.com',
      });

    await signUp();
    const res = await signUp();

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      error: 'Unauthorized',
      message: 'Já existe um usuário com este e-mail.',
      statusCode: 401,
    });
  });
});
