import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options
}: {
  payload: string | Buffer | object
  privateKey?: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  publicOrPrivateKey = process.env.JWT_SECRET as string
}: {
  token: string
  publicOrPrivateKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, publicOrPrivateKey, (error, decode) => {
      if (error) {
        throw reject(error)
      }
      resolve(decode as jwt.JwtPayload)
    })
  })
}
