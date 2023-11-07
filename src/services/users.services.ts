import User from "~/models/schemas/User.schemas";
import databaseService from "./database.services";
import { RegisterReqBody } from "~/models/requests/User.requests";

class UsersService {
    async reigster(payload: RegisterReqBody) {
        const result = await databaseService.users.insertOne(new User({
            ...payload,
            date_of_birth: new Date(payload.date_of_birth)
        }))
        return result
    }
    async checkEmailExist(email: string) {
        const user = await databaseService.users.findOne({ email })
        return Boolean(user)
    }
}

const usersService = new UsersService()

export default usersService