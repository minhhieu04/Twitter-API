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
  LOGIN_SUCCESS: 'Login success',
  LOGOUT_SUCCESS: 'Logout success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_HAS_BEEN_USED_OR_DOES_NOT_EXIST: 'Refresh token has already been used or does not exist',
  EMAIL_VERIFICATION_TOKEN_IS_REQUIRED: 'Email verification token is required',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'email already verified before',
  VERIFY_EMAIL_SUCCESS: 'Verify email success',
  RESEND_EMAIL_VERIFICATION_SUCCESS: 'resend email verification success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_ME_SUCCESS: 'Get my profile success',
  USER_NOT_VERIFIED: 'User not verified',
  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_A_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_A_STRING: 'Username must be a string',
  INVALID_USERNAME:
    'Username must be 4-15 characters long and contain only letters, numbers, not only numbers and underscores',
  IMAGE_URL_MUST_BE_A_STRING: 'Image URL must be a string',
  IMAGE_URL_LENGTH: 'Image URL length must be from 3 to 400',
  UPDATE_MY_PROFILE_SUCCESS: 'Update my profile success',
  FOLLOW_SUCCESS: 'Follow success',
  FOLLOWED: 'This user has been followed before',
  FOLLOWED_USER_ID_IS_REQUIRED: 'Followed user ID is required',
  INVALID_USER_ID: 'Invalid user ID',
  ALREADY_UNFOLLOWED: 'This user has not been followed before',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  USERNAME_ALREADY_EXIST: 'Username already exists',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success'
} as const

export const MEDIAS_MESSAGE = {
  NOT_FOUND: 'Not found',
  UPLOAD_IMAGE_SUCCESS: 'Upload image successfully',
  UPLOAD_VIDEO_SUCCESS: 'Upload video successfully',
  GET_VIDEO_STATUS_SUCCESS: 'Get video status successfully'
} as const

export const TWEETS_MESSAGE = {
  INVALID_TYPE: 'Invalid tweet type',
  INVALID_AUDIENCE: 'Invalid audience type',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent id must be a valid tweet id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_NOT_EMPTY_STRING: 'Content must be not be empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user ID',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  CREATE_TWEET_SUCCESS: 'Created tweet successfully',
  INVALID_TWEET_ID: 'Invalid tweet id',
  TWEET_NOT_FOUND: 'Tweet not found'
} as const

export const BOOKMARKS_MESSAGE = {
  ADD_BOOKMARK_SUCCESS: 'Added bookmark successfully',
  UNBOOKMARK_SUCCESS: 'Unbookmark successfully'
}
