import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiGetProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'User profile retrieved successfully',
      example: { email: 'johndoe@gmail.com', name: 'John Doe' },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
