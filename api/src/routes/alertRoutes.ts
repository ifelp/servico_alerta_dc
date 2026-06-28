import { AlertController } from "@controllers";
import { Router } from "express";
import { verifySecret } from "@middlewares";

const AlertRouter = Router();

AlertRouter.post('/', verifySecret, AlertController.create);

export default AlertRouter;