import { AlertController } from "@controllers";
import { Router } from "express";

const AlertRouter = Router();

AlertRouter.post('/', AlertController.create);

export default AlertRouter;