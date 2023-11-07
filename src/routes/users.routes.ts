import { Router } from 'express'
import { userRegisterController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/users.middlewares'
const userRouter = Router()

/**
 * Description: Register a new user
 * Path: register/
 * Method: POST
 * Body: {email: string, name: string, password: string, confirm_password: string, date_of_birth: ISO8601}
 */
userRouter.post('/register', registerValidator, userRegisterController)

export default userRouter
