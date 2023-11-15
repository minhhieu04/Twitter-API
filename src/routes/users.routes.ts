import { wrapRequestHandler } from './../utils/handles'
import { Router } from 'express'
import {
  userLoginController,
  userLogoutController,
  userRegisterController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  loginValidator,
  accessTokenValidator,
  registerValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator
} from '~/middlewares/users.middlewares'
const userRouter = Router()

/**
 * Description: Register a new user
 * Path: register/
 * Method: POST
 * Body: { email: string, name: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
userRouter.post('/register', registerValidator, wrapRequestHandler(userRegisterController))

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
 * Description: Verify email when user is register
 * Path: verify-email/
 * Method: POST
 * Body: { email_verify_token: string }
 */
userRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

export default userRouter
