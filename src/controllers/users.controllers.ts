import { Request, Response } from "express"
import User from "~/models/schemas"
import databaseService from "~/services/database.services"

export const userRegister = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const result = await databaseService.users.insertOne(new User({
            email,
            password
        }))
        res.status(201).json({
            message: "User created successfully",
            result
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