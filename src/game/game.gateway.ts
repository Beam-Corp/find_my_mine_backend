import { Logger } from '@nestjs/common'
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'

import { Socket, Server } from 'socket.io'

import { GameEvents, GameStartPayload, GameState, SurrenderState } from './game.events'
import { GameService } from './game.service'

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  private gameService: GameService = new GameService()
  private logger: Logger = new Logger('GameGateway')

  afterInit() {
    this.logger.log('Init')
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload)
  }

  @SubscribeMessage(GameEvents.START)
  handleGameInit(client: Socket, roomId: string): void {
    this.logger.log(`Starting Game for room id ${roomId}`)
    const payload: GameStartPayload = {
      gridState: this.gameService.generateGrid(12, 6),
      playerTurn: this.gameService.randomPlayer(),
    }
    this.server.to(roomId).emit(GameEvents.ON_STARTED, payload)
  }

  @SubscribeMessage(GameEvents.SELECT_BLOCK)
  handleSelectBlock(client: Socket, gameState: GameState): void {
    this.logger.log(`Select block`)
    this.server.to(gameState.roomId).emit(GameEvents.ON_SELECTED, gameState)
  }

  @SubscribeMessage(GameEvents.TIME_UP)
  handleTimeUp(client: Socket, gameState: GameState): void {
    this.logger.log(`Time Up`)

    this.server.to(gameState.roomId).emit(GameEvents.ON_TIME_UP, gameState)
  }

  @SubscribeMessage(GameEvents.SURRENDER)
  handleSurrender(client: Socket, surrenderState: SurrenderState): void {
    this.logger.log(`player ${surrenderState.surrenderer} has surrendered`)

    this.server.to(surrenderState.roomId).emit(GameEvents.ON_SURRENDER, surrenderState)
  }

  @SubscribeMessage(GameEvents.RESTART)
  handleRestart(client: Socket, roomId: string): void {
    this.logger.log(`Restarting Game for room id ${roomId}`)
    const gameState: GameState = {
      clickNumber: 0,
      gridState: this.gameService.generateGrid(12, 6),
      playerTurn: this.gameService.randomPlayer(),
      scoreState: [0, 0],
      roomId: roomId
    }

    this.server.to(roomId).emit(GameEvents.ON_RESTART, gameState)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }
}
