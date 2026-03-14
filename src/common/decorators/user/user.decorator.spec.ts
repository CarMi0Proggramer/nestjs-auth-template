import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { getUser } from './user.decorator';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn(),
  InternalServerErrorException:
    jest.requireActual('@nestjs/common').InternalServerErrorException,
}));

describe('UserDecorator', () => {
  const mockRequest = { user: { sub: 'USER_ID' } };
  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
    }),
  } as unknown as ExecutionContext;

  it('should return user object from request', () => {
    const result = getUser(undefined, mockExecutionContext);
    expect(result).toEqual(mockRequest.user);
  });

  it('should extract and return user property from request', () => {
    const result = getUser('sub', mockExecutionContext);
    expect(result).toEqual(mockRequest.user.sub);
  });

  it('should throw an error if user is not found in request', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    expect(() => getUser(undefined, mockExecutionContext)).toThrow(
      new InternalServerErrorException(
        'O usuário não foi encontrado na request',
      ),
    );
  });
});
