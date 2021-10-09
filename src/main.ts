import { NestFactory } from "@nestjs/core";
import { env } from "process";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
