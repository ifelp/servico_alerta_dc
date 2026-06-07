import Express, { Request, Response } from "express";
import cors from "cors";
import router from "@routes";

const app = Express();
const port = process.env.PORT || 3001;

app.use(Express.json());
app.use(cors({
    origin: ["*"] //enquanto ainda não temos os serviços bem definidos.
}))

app.use(router);

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
})