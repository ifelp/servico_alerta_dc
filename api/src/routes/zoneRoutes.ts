import { ZoneController } from "@controllers";
import { Router } from "express";
import { verifySecret } from "@middlewares";

const ZoneRouter: Router = Router();

ZoneRouter.get('/', ZoneController.getAllZones);
ZoneRouter.post('/', verifySecret, ZoneController.create);

export default ZoneRouter;