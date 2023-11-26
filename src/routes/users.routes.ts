import { wrapRequestHandler } from './../utils/handles'
import { Router } from 'express'
import {
  followController,
  forgotPasswordController,
  getMeController,
  resentEmailVerifyController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  userLoginController,
  userLogoutController,
  userRegisterController,
  verifyEmailController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  loginValidator,
  accessTokenValidator,
  registerValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  verifyForgotPasswordTokenValidator,
  resetPasswordValidator,
  verifiedUserValidator,
  updateMeValidator,
  followValidator,
  unfollowValidator
} from '~/middlewares/users.middlewares'
import { RegisterReqBody, ResetPasswordReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
const userRouter = Router()

/**
 * Description: Register a new user
 * Path: register/
 * Method: POST
 * Body: { email: string, name: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
userRouter.post(
  '/register',
  registerValidator,
  filterMiddleware<RegisterReqBody>(['email', 'name', 'password', 'confirm_password', 'date_of_birth']),
  wrapRequestHandler(userRegisterController)
)

/**
 * Description: Login a user
 * Path: login/
 * Method: POST
 * Body: { email: string, password: string }
 */
userRouter.post('/login', loginValidator, wrapRequestHandler(userLoginController))

/**
 * Description: Logout a user
 * Path: logout/
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { refresh_token: string }
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(userLogoutController))

/**
 * Description: Verify email when user click on the link in email
 * Path: verify-email/
 * Method: POST
 * Body: { email_verify_token: string }
 */
userRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Resent email verify when user doesn't verify click on the button resend the email verification token
 * Path: resent-verify-email/
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: {}
 */
userRouter.post('/resend-email-verify', accessTokenValidator, wrapRequestHandler(resentEmailVerifyController))

/**
 * Description: When the user forgot password and click on the button, then user submit email to reset password, a link is will be sent to the email
 * Path: resent-verify-email/
 * Method: POST
 * Body: {email: string}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Verify  forgot password link
 * Path: verify-forgot-password/
 * Method: POST
 * Body: {email: string}
 */
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)

/**
 * Description: Reset password when verify forgot password token successfully
 * Path: reset-password/
 * Method: POST
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */
userRouter.post(
  '/reset-password',
  resetPasswordValidator,
  filterMiddleware<ResetPasswordReqBody>(['forgot_password_token', 'new_password', 'confirm_new_password']),
  wrapRequestHandler(resetPasswordController)
)

/**
 * Description: Get my profile
 * Path: me/
 * Method: GET
 * Headers: { Authorization: 'Bearer ' + access_token }
 */
userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * Path: me/
 * Method: PATCH
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { name?: string, date_of_birth?: string, bio?: string, location?: string, website?: string, username?: string, avatar?: string, cover_photo?: string }
 */
userRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'avatar',
    'bio',
    'location',
    'username',
    'date_of_birth',
    'name',
    'website',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Follow someone
 * Path: follow/
 * Method: POST
 * Headers: { Authorization: 'Bearer ' + access_token }
 * Body: { followed_user_id: string }
 */
userRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description: Unfollow someone
 * Path: follow/:followed_user_id
 * Method: DELETE
 * Headers: { Authorization: 'Bearer ' + access_token }
 * { Params: user_id }
 */
userRouter.delete(
  '/follow/:followed_user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

export default userRouter
