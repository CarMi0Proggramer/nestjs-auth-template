import { applyDecorators } from '@nestjs/common';
import { ApiFoundResponse, ApiOperation } from '@nestjs/swagger';

export function ApiGoogleLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Redirects user to the google sign in page' }),
    ApiFoundResponse({
      description: 'Redirect to Google OAuth callback url after authentication',
      headers: {
        Location: {
          description: 'URL where the client is redirected',
          schema: {
            type: 'string',
            example: '/api/auth/google/callback',
          },
        },
      },
    }),
  );
}
