export const PublicErrorCode = {
  UsernameExist: 'UsernameExist',
  InvalidPw: 'InvalidPw',
  InvalidLoginPw: 'InvalidLoginPw',
  InvalidOtp: 'InvalidOtp',
  EmailExist: 'EmailExist',
  AccountIsLocked: 'AccountIsLocked',
} as const;

export type PublicErrorCode =
  (typeof PublicErrorCode)[keyof typeof PublicErrorCode];
