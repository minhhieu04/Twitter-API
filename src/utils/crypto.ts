import { createHash } from 'crypto'
export const sha256 = (content: string) => {
  return createHash('sha3-256').update(content).digest('hex')
}

export const hashPassword = (password: string) => {
  return sha256(password + process.env.PASSWORD_SALT)
}
