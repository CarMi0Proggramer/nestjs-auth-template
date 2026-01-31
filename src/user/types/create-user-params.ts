import { AuthProvider } from '@/common/enums/auth-provider.enum';

export type CreateUserParams =
  | {
      name: string;
      password: string;
      email: string;
      authProvider: AuthProvider.LOCAL;
    }
  | { name: string; email: string; authProvider: AuthProvider.GOOGLE };
