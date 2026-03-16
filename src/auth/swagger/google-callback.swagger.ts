import { applyDecorators } from '@nestjs/common';
import { ApiFoundResponse, ApiOperation } from '@nestjs/swagger';

export function ApiGoogleCallback() {
  return applyDecorators(
    ApiOperation({
      summary: 'Google OAuth callback',
      description:
        'Handles Google OAuth response and redirects to the frontend with accessToken and refreshToken',
    }),
    ApiFoundResponse({
      description: 'Redirects to frontend with authentication tokens',
      headers: {
        Location: {
          description: 'Frontend redirect URL with tokens',
          schema: {
            type: 'string',
            example: 'https://frontend.com?accessToken=JWT&refreshToken=JWT',
          },
        },
      },
    }),
  );
}
