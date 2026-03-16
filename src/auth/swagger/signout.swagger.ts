import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiSignOut() {
  return applyDecorators(
    ApiOperation({ summary: 'Signs out the user' }),
    ApiOkResponse({ example: { message: 'User signed out successfully' } }),
    ApiUnauthorizedResponse({
      description: 'User access token is not provided',
    }),
  );
}
