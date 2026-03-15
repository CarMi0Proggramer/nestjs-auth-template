import request from 'supertest';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/database/entities/User';
import { GoogleAuthGuard } from '../../src/auth/guards';
import { AuthService } from '../../src/auth/auth.service';
import { envs } from '../../src/config/envs';

describe('AuthController (e2e) - Google Login', () => {
  const testLocalUser = {
    name: 'Test User',
    email: 'googlelogin@gmail.com',
    password: 'password123',
  };

  let app: INestApplication<App>;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(GoogleAuthGuard)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const req = ctx.switchToHttp().getRequest();
          req.user = { id: 'USER_ID' };

          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    const userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    await userRepository.delete({ email: testLocalUser.email });
    await request(app.getHttpServer()).post('/auth/signup').send(testLocalUser);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should login and return status 200 with mocked guard', async () => {
    const res = await request(app.getHttpServer()).get('/auth/google');
    expect(res.status).toBe(200);
  });

  it('should redirect to frontend url with tokens', async () => {
    const redirectUrl = `${envs.frontendUrl}?accessToken=ACCESS_TOKEN&refreshToken=REFRESH_TOKEN`;

    jest.spyOn(authService, 'login').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    const res = await request(app.getHttpServer()).get('/auth/google/callback');

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(redirectUrl);
  });
});
