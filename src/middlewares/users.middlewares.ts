import usersService from '~/services/users.services'
import { validate } from './../utils/validation'
import { checkSchema } from 'express-validator'
import { USERS_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.NAME_IS_REQUIRED
      },
      isLength: {
        options: { min: 3, max: 255 },
        errorMessage: USERS_MESSAGE.NAME_LENGTH_MUST_BE_FROM_3_TO_225
      },
      trim: true,
      escape: true,
      isString: {
        errorMessage: USERS_MESSAGE.NAME_MUST_BE_A_STRING
      }
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
      },
      trim: true,
      escape: true,
      custom: {
        options: async (email: string) => {
          const isExistEmail = await usersService.checkEmailExist(email)
          if (isExistEmail) {
            throw new Error(USERS_MESSAGE.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USERS_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      isStrongPassword: {
        options: { minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
        errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
      },
      isString: true
    },
    confirm_password: {
      notEmpty: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50
      },
      isStrongPassword: {
        options: { minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
        errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      isString: {
        errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_A_STRING
      },
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: USERS_MESSAGE.PASSWORD_DO_NOT_MATCH
      }
    },
    date_of_birth: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.DATE_OF_BIRTH_IS_REQUIRED
      },
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USERS_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO8601
      }
    }
  })
)

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
      },
      trim: true,
      escape: true,
      custom: {
        options: async (email: string, { req }) => {
          const user = await databaseService.users.findOne({ email: email })
          if (!user) {
            throw new Error(USERS_MESSAGE.USER_NOT_FOUND)
          }

          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USERS_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      isStrongPassword: {
        options: { minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
        errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
      },
      isString: true,
      custom: {
        options: async (password: string, { req }) => {
          const user = await databaseService.users.findOne({ password: hashPassword(password) })
          if (!user) {
            throw new Error(USERS_MESSAGE.WRONG_PASSWORD)
          }
          return true
        }
      }
    }
  })
)
