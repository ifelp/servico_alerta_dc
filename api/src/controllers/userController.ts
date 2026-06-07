import { Request, Response } from "express";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "@types";
import { UserService } from "@services";

export class UserController{

    static async create(req: Request, res: Response){
        try{
            const dto: CreateUserDTO = req.body;
            const { name, email, rawPassword } = dto;

            const user = UserService.register({
                name,
                email,
                rawPassword
            })

            return res.status(201).json({
                message: "Usuário cadastrado com sucesso.",
                user
            });
        } catch(error: any) {
            console.error(error);
            return res.status(400).json({
                message: "Erro durante cadastro de usuário.",
            })
        }
    }

}
