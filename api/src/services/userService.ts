import { dbClient } from "@config";
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

    static async getAll(): Promise<UserResponseDTO[]>{
        const users = await UserModel.findAll();

        return users;
    }

    static async getByEmail(email: string): Promise<UserResponseDTO | null>{
        const user = await UserModel.findByEmail(email);

        return user;
    }

    static async getById(id: number): Promise<UserResponseDTO | null>{
        const user = await UserModel.findById(id);

        return user;
    }

    static async update(id: number, data: UpdateUserDTO): Promise<boolean> {

        const userExists = await UserModel.findById(id);
        if(!userExists) throw new Error("O usuário não existe no banco de dados.");

        const dataToUpdate: any = {}

        if(data.name) dataToUpdate.name = data.name;
        if(data.email) {
            const emailExists = await UserModel.findByEmail(data.email);
            if(emailExists) throw new Error("E-mail informado pelo usuário já está em uso.");
            dataToUpdate.email = data.email;
        }
        if(data.rawPassword){
            const hashedPassword = await bcrypt.hash(data.rawPassword, saltRounds);
            dataToUpdate.password_hash = hashedPassword;
        }

        const result = await UserModel.update(id, dataToUpdate);

        return result;
    }

}