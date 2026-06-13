import Express from "express";
import cors from "cors";
import router from "@routes";
import { runMigrations } from "@config";
import { connectMqttBroker } from "@mqtt/client";

const app = Express();
const port = Number(process.env.PORT ?? 3001);

async function bootstrap() {
  await runMigrations();
  await connectMqttBroker();

  app.use(Express.json());
  app.use(
    cors({
      origin: ["*"]
    })
  );

  app.use(router);

  app.listen(port, () => {
    console.log(`App escutando na porta ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar a aplicação:", error);
  process.exit(1);
});