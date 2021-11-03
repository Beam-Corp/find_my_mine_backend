import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GameModule } from './game/game.module'
import { RoomModule } from './room/room.module'
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.development', '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI || "mongodb+srv://admin:vkdCbdUlyp9pZ3YR@cluster0.q1gam.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-hj2588-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true"),
    GameModule,
    RoomModule,
    AuthModule,
    PlayerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
