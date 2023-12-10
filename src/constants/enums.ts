export enum UserVerifyStatus {
  Unverified, // default = 0
  Verified, // verified email
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}

export enum newUserType {
  Login,
  Register
}

export enum MediaType {
  Image,
  Video,
  HLS
}
