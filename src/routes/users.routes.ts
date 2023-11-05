import { Router } from 'express'
import { userRegisterController } from '~/controllers/users.controllers'
const userRouter = Router()

userRouter.post('/register', userRegisterController)

export default userRouter
