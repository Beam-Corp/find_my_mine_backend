import { Controller, Get, Query } from '@nestjs/common'

import { PlayerService } from './player.service'

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('stats')
  async getStats(@Query('userId') userId) {
    const player = await this.playerService.findByPlayerId(userId)
    if (player) return { userId: player.userId, statistics: player.statistics }
    else return { userId: '', statistics: { winCount: 0, drawCount: 0, loseCount: 0 } }
  }
}
