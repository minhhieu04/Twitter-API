export const USERS_MESSAGE = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_3_TO_225: 'Name length must be from 3 to 225',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must contain at least 6 characters, at least 1 uppercase letter and at least 1 number',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50: 'Confirm password must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must contain at least 6 characters, at least 1 uppercase letter and at least 1 number',
  PASSWORD_DO_NOT_MATCH: 'Password do not match',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth must be required',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be a valid ISO 8601 date',
  USER_NOT_FOUND: 'User not found',
  WRONG_PASSWORD: 'Wrong password',
  REGISTER_SUCCESS: 'Registration success',
  LOGIN_SUCCESS: 'Login success'
} as const
