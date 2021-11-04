import { PlayerModule } from 'src/player/player.module'

import { Module } from '@nestjs/common'

import { GameGateway } from './game.gateway'
import { GameService } from './game.service'

@Module({
  imports: [PlayerModule],
  providers: [GameService, GameGateway],
})
export class GameModule {}
