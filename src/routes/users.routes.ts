import { Router } from "express";
import { userRegister } from "~/controllers/users.controllers";
const userRouter = Router();

userRouter.post("/register", userRegister)

export default userRouter
