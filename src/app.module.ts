import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RoomModule } from "./room/room.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://beam-corp:${process.env.db_key || "sM1o0Crmutx372u2"}@cluster0.x6626.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    ),
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
