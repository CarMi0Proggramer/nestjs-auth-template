import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_GUARD_KEY = 'SKIP_JWT_GUARD';
export const SkipJwtGuard = () => SetMetadata(SKIP_JWT_GUARD_KEY, true);
