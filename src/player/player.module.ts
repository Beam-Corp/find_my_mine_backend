import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PlayerController } from './player.controller'
import { PlayerSchema } from './player.schema'
import { PlayerService } from './player.service'

@Module({
  providers: [PlayerService],
  imports: [MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }])],
  exports: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
