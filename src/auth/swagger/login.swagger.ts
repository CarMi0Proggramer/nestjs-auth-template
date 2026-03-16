import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

class LoginDto {
  @ApiProperty({ example: 'john123' })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  email: string;
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login with email and password' }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description: 'User successfully authenticated',
      example: {
        id: crypto.randomUUID(),
        accessToken: 'JWT',
        refreshToken: 'JWT',
      },
    }),
    ApiUnauthorizedResponse({ description: 'Missing credentials' }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiConflictResponse({ description: 'User is registered with Google' }),
    ApiBadRequestResponse({ description: 'Incorrect password' }),
  );
}
