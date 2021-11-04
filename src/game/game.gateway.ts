import { RoomGateway } from 'src/room/room.gateway'

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

import {
  GameEvents,
  GameStartPayload,
  GameStartSettings,
  GameState,
  SurrenderState,
  MessagePayload,
} from './game.events'
import { GameService } from './game.service'

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  private gameService: GameService = new GameService()
  private logger: Logger = new Logger('GameGateway')
  private roomGateWay: RoomGateway = new RoomGateway()

  afterInit() {
    this.logger.log('Init')
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload)
  }

  @SubscribeMessage(GameEvents.START)
  handleGameInit(client: Socket, settings: GameStartSettings): void {
    this.logger.log(`Starting Game for room id ${settings.roomId}`)
    const payload: GameStartPayload = {
      gridState: this.gameService.generateGrid(settings.bombNumber, settings.gridSize),
      playerTurn: this.gameService.randomPlayer(),
      initialTimer: settings.initialTimer
    }
    this.server.to(settings.roomId).emit(GameEvents.ON_STARTED, payload)
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
  handleRestart(client: Socket, settings: GameStartSettings): void {
    this.logger.log(`Restarting Game for room id ${settings.roomId}`)
    const gameState: GameState = {
      clickNumber: 0,
      gridState: this.gameService.generateGrid(settings.bombNumber, settings.gridSize),
      playerTurn: this.gameService.randomPlayer(),
      scoreState: [0, 0],
      roomId: settings.roomId,
    }

    this.server.to(settings.roomId).emit(GameEvents.ON_RESTART, gameState)
  }

  @SubscribeMessage(GameEvents.SEND_MESSAGE)
  handleSendMessage(client: Socket, payload: MessagePayload):void {
    const roomId = payload[0].roomId
    this.logger.log(`${roomId} has sent a message`)

    this.server.to(roomId).emit(GameEvents.ON_SEND_MESSAGE, payload)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
    this.roomGateWay.getConcurrentPlayers(this.server)
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
    this.roomGateWay.getConcurrentPlayers(this.server)
  }
}
