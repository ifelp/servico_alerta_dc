import { Router } from "express";
import UserRouter from "./userRoutes";
import AlertRouter from "./alertRoutes";
import ZoneRouter from "./zoneRoutes";

const router: Router = Router();

router.get('/', (_, res) => {
    return res.status(200).json({
        message: "Feito com <3 e :D no Cin!"
    });
})

router.post('/op-login', (req, res) => {
    const { id } = req.body
    const ops = JSON.parse(process.env.OP_LIST as string) as string[] || []
    for(const op of ops){
        if(id === op) return res.status(200).send();
        else continue;
    }
    return res.status(401).send();
})

//Rotas para User
router.use('/user', UserRouter);
router.use('/alert', AlertRouter);
router.use('/zone', ZoneRouter);

export default router;