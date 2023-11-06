import { Request, Response } from "express"
import usersService from "~/services/users.services"

export const userRegisterController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        usersService.reigster({ email, password })
        res.status(201).json({
            message: "User created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json(
            {
                status: 400,
                message: 'Register failed'
            }
        )
    }
}