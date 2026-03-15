export type AuthJwtPayload = {
  sub: string;
  // Standard JWT ID claim to differentiate tokens independently of the signing time
  jti: string;
};
