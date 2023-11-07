import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'
import usersService from '~/services/users.services'

export const userRegisterController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    usersService.reigster(req.body)
    res.status(201).json({
      message: 'User created successfully'
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: 400,
      message: 'Register failed'
    })
  }
}
