import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGE } from '~/constants/message'
import { LoginReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import usersService from '~/services/users.services'

export const userRegisterController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.status(201).json({
    message: USERS_MESSAGE.REGISTER_SUCCESS,
    result
  })
}

export const userLoginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id
  const result = await usersService.login(user_id.toString())
  res.status(201).json({
    message: USERS_MESSAGE.LOGIN_SUCCESS,
    result
  })
}
