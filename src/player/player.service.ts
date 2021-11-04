import { Roles } from 'src/auth/jwt.constant'
import { EndGameState } from 'src/game/game.events'

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { PlayerDTO } from './dto/player.dto'
import { Player, PlayerDoucument } from './player.schema'

@Injectable()
export class PlayerService {
  constructor(@InjectModel('Player') private playerModel: Model<PlayerDoucument>) {}
  async findByPlayerId(id: string) {
    const player = await this.playerModel.findOne({ userId: id }).then()
    return player
  }
  async login(userId: string, password: string) {
    const player = await this.findByPlayerId(userId)
    if (!player) throw new BadRequestException('UserId does not exist')
    const isPasswordValid = await bcrypt.compare(password, player.password)
    if (!isPasswordValid) throw new UnauthorizedException('Wrong password')
    return player
  }
  async register({ userId, password, customization }: PlayerDTO) {
    if (await this.findByPlayerId(userId)) throw new BadRequestException('UserId already exist')
    const hashedPassword = await bcrypt.hash(password, 10)
    const newPlayerData = {
      userId,
      password: hashedPassword,
      customization,
      role: Roles.Player,
      statistics: { winCount: 0, drawCount: 0, loseCount: 0 },
    }
    const player = await this.playerModel.create(newPlayerData)
    return await player.save()
  }

  async updateMatchHistory(matchResult: EndGameState) {
    const { surrendererNumber, scoreState, playerNumber, userId } = matchResult

    const player: Player = await this.findByPlayerId(userId.substring(2))

    if (player) {
      let { winCount, drawCount, loseCount } = player.statistics

      const playerIndex = playerNumber - 1
      const scoreResult = scoreState[playerIndex] - scoreState[(playerIndex + 1) % 2]

      if (surrendererNumber > 0 && surrendererNumber === playerNumber) loseCount += 1
      else if (surrendererNumber > 0 && surrendererNumber !== playerNumber) winCount += 1
      else if (surrendererNumber === 0) {
        if (scoreResult < 0) loseCount += 1
        else if (scoreResult > 0) winCount += 1
        else if (scoreResult === 0) drawCount += 1
      }

      const updatedStatistics = { winCount, drawCount, loseCount }

      await this.playerModel.findOneAndUpdate({ userId: userId.substring(2) }, { statistics: updatedStatistics })
    }
  }
}
