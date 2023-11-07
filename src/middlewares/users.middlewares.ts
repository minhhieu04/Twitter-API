import { validate } from './../utils/validation';
import { checkSchema } from "express-validator";

export const registerValidator = validate(checkSchema({
    name: {
        notEmpty: true,
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "Name must be between 3 and 255 characters"
        },
        trim: true,
        escape: true,
        isString: true
    },
    email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        escape: true,
        errorMessage: "Invalid email"
    },
    password: {
        notEmpty: true,
        isLength: {
            options: { min: 6, max: 50 },
            errorMessage: "Password must be between 6 and 50 characters"
        },
        isStrongPassword: {
            options: { minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
            errorMessage: "Password must contain at least 6 characters, at least 1 uppercase letter and at least 1 number"
        },
        isString: true
    },
    confirm_password: {
        notEmpty: true,
        isLength: {
            options: { min: 6, max: 50 },
            errorMessage: "Password must be between 6 and 50 characters"
        },
        isStrongPassword: {
            options: { minLength: 6, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
            errorMessage: "Password must contain at least 6 characters, at least 1 uppercase letter and at least 1 number"
        },
        isString: true,
        custom: {
            options: (value, { req }) => value === req.body.password,
            errorMessage: "Passwords do not match"
        }
    },
    date_of_birth: {
        notEmpty: true,
        isISO8601: {
            options: {
                strict: true,
                strictSeparator: true
            },
            errorMessage: "Date of birth must be a valid ISO 8601 date"
        }
    }
}))