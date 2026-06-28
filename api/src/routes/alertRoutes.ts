import { AlertController } from "@controllers";
import { Router } from "express";
import { verifySecret } from "@middlewares";

const AlertRouter = Router();

AlertRouter.post('/', AlertController.create);
AlertRouter.get('/', AlertController.getAll);
AlertRouter.get('/zona/:zona', AlertController.getByZone);
AlertRouter.get('/zona/:zona/ultima', AlertController.getLatestByZone);

export default AlertRouter;