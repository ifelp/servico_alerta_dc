import { UserController } from "@controllers";
import { Router } from "express";

const UserRouter: Router = Router();

UserRouter.get('/', UserController.getAllUsers);
UserRouter.post('/', UserController.create);
UserRouter.patch('/?id', UserController.updateUser);
UserRouter.delete('/?id', UserController.deleteUser);
UserRouter.get('/id?id', UserController.getUserById);

export default UserRouter;