import { Request, Response } from "express";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "@types";
import { UserService } from "@services";

export class UserController{

    static async create(req: Request, res: Response){
        try {
            const dto: CreateUserDTO = req.body;
            const { name, email, rawPassword } = dto;

            Object.values(dto).map(val => {
                if(typeof(val) == undefined) throw new Error("Campo faltante.");
            });

            const user = await UserService.register({
                name,
                email,
                rawPassword
            })

            return res.status(201).json({
                message: "Usuário cadastrado com sucesso.",
                user
            });

        } catch(error: any) {
            console.error(error.message);
            return res.status(400).json({
                message: "Erro durante cadastro de usuário.",
                error: error.message
            })
        }
    }

    static async getAllUsers(req: Request, res: Response){
        try{
            const users = await UserService.getAll();

            return res.status(200).json(users);

        } catch(error: any) {
            console.error(error.message);
            return res.status(500).send();
        }
    }

    static async getUserById(req: Request, res: Response){
        try{
            const { id } = req.params;
            if(Number.isNaN(id)) throw new Error("Id do usuário inválido.");

            const user = await UserService.getById(Number(id));

            if(!user) return res.status(204).send();
            return res.status(200).json(user);

        } catch (error: any) {
            console.error(error.message)
            if(error.message == "Id do usuário inválido.") return res.status(400).json({ error: error.message });
            return res.status(500).send();
        }
    }

    static async updateUser(req: Request, res: Response){
        try{
            const dto: UpdateUserDTO = req.body;
            const { id } = req.params;

            if(Number.isNaN(id)) throw new Error("Id do usuário inválido.");

            const updt = await UserService.update(Number(id), dto);
            
            if(!updt) throw new Error("Dados vazios ou inalterados.");
            return res.status(200).json({
                message: "Usuário atualizado com sucesso."
            })

        } catch(error: any){
            if(error.message == "Id do usuário inválido.") return res.status(400).json({
                error: error.message
            })
            if(error.message == "Dados vazios ou inalterados.") return res.status(400).json({
                error: error.message
            })
            if(error.message == "E-mail informado pelo usuário já está em uso.") return res.status(400).json({
                error: error.message
            })
            if(error.message == "O usuário não existe no banco de dados.") return res.status(404).json({
                error: error.message
            })

            return res.status(500).send();
        }
    }

    static async deleteUser(req: Request, res: Response){
        try{
            const { id } = req.params;
            
            if(Number.isNaN(id)) throw new Error("Id do usuário inválido.");

            const remv = await UserService.remove(Number(id));

            if(!remv) throw new Error("Usuário não encontrado.");
            return res.status(204).send();
            
        } catch(error: any){
            if(error.message == "Id do usuário inválido.") return res.status(400).json({
                error: error.message
            })
            if(error.message == "Usuário não encontrado.") return res.status(404).json({
                error: error.message
            })

            return res.status(500).send();
        }
    }

}
