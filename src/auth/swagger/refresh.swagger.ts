import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh user access token and refresh token' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Tokens refreshed',
      example: {
        accessToken: 'JWT',
        refreshToken: 'JWT',
      },
    }),
    ApiUnauthorizedResponse({
      description:
        'Refresh token is not provided in the authorization header, is not valid or the user is not logged in',
    }),
  );
}
