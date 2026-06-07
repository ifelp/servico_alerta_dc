import { Request, Response } from "express";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "@types";
import { UserService } from "@services";

export class UserController{

    static async create(req: Request, res: Response){
        try {
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
                error: error.message
            })
        }
    }

    static async getAllUsers(res: Response){
        try{
            const users = await UserService.getAll();

            return res.status(200).json(users);

        } catch(error: any) {
            console.error(error);
            return res.status(500).send();
        }
    }

    static async getUserById(req: Request, res: Response){
        try{
            const { id } = req.query;
            if(Number.isNaN(id)) throw new Error("Id do usuário inválido.");

            const user = await UserService.getById(Number(id));

            if(!user) return res.status(204).send();
            return res.status(200).json(user);
            
        } catch (error: any) {
            console.error(error)
            if(error.message == "Id do usuário inválido.") return res.status(400).json({ error: error.message });
            return res.status(500).send();
        }
    }

}
