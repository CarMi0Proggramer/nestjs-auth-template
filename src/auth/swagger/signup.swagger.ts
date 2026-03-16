import { applyDecorators } from '@nestjs/common';
import { SignUpDto } from '../dto/signup.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiSignUp() {
  return applyDecorators(
    ApiOperation({ summary: 'Signs up user with email and password' }),
    ApiBody({ type: SignUpDto }),
    ApiCreatedResponse({
      description: 'User successfully created and authenticated',
      example: {
        id: crypto.randomUUID(),
        accessToken: 'JWT',
        refreshToken: 'JWT',
      },
    }),
    ApiUnauthorizedResponse({ description: 'User email already exists' }),
    ApiBadRequestResponse({
      description: 'Validation error',
      example: {
        statusCode: 400,
        message: [
          'name is required',
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Bad Request',
      },
    }),
  );
}
