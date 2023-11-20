import { wrapRequestHandler } from './../utils/handles'
import { Router } from 'express'
import {
  getMeController,
  userLoginController,
  userLogoutController,
  userRegisterController
} from '~/controllers/users.controllers'
import {
  loginValidator,
  accessTokenValidator,
  registerValidator,
  refreshTokenValidator
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
 * Description: Get my profile
 * Path: me/
 * Method: GET
 * Headers: { Authorization: 'Bearer ' + access_token }
 */
userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

export default userRouter
