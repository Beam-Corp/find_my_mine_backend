import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://beam-corp:${process.env.db_key}@cluster0.x6626.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
