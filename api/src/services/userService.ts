import { UserModel } from "@models";
import { CreateUserDTO, UserResponseDTO, UpdateUserDTO } from "@types";
import bcrypt from "bcryptjs";

const saltRounds = 6;

export class UserService{

    static async register(data: CreateUserDTO): Promise<UserResponseDTO>{

        const { email, rawPassword } = data;
        const userExists = await UserModel.findByEmail(email);

        if(userExists) throw new Error("Já existe um usuário com este e-mail.");

        const password_hash = await bcrypt.hash(rawPassword, saltRounds);

        const user = await UserModel.create({
            ...data,
            password_hash
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }
}