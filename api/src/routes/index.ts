import { Router } from "express";
import UserRouter from "./userRoutes";

const router: Router = Router();

router.use('/user', UserRouter);

export default router;