export enum UserVerifyStatus {
  Unverified, // default = 0
  Verified, // verified email
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  PasswordResetToken,
  EmailVerificationToken
}