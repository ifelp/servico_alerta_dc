import { Router } from "express";
import UserRouter from "./userRoutes";

const router: Router = Router();

router.get('/', (_, res) => {
    return res.status(200).json({
        message: "Feito com <3 e :D no Cin!"
    });
})

//Rotas para User
router.use('/user', UserRouter);

export default router;