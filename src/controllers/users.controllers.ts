import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId, ReturnDocument } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyEmailReqBody,
  VerifyForgotPasswordTokenReqBody,
  ResetPasswordReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
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
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  res.status(201).json({
    message: USERS_MESSAGE.LOGIN_SUCCESS,
    result
  })
}

export const userLogoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  res.status(200).json(result)
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
  const { user_id } = req.decode_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  // If the user is not found in the database then return error
  if (!user) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGE.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  // If previously verified, return the corresponding message and OK status
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGE.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGE.VERIFY_EMAIL_SUCCESS,
    result
  })
}

export const resentEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  if (!user_id) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGE.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user?.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGE.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = usersService.resendEmailVerification(user_id)
  return res.json({ result })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json({ result })
}

export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordTokenReqBody>,
  res: Response
) => {
  return res.json({ message: USERS_MESSAGE.VERIFY_FORGOT_PASSWORD_SUCCESS })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_forgot_password as TokenPayload
  const { new_password } = req.body
  const result = await usersService.resetPassword(user_id, new_password)
  return res.json({ result })
}
export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGE.GET_ME_SUCCESS,
    result: user
  })
}
