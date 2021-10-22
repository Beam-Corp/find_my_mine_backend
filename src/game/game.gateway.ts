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

import { GameEvents } from './game.events'

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private logger: Logger = new Logger('GameGateway')

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload)
  }

  @SubscribeMessage(GameEvents.START)
  handleGameInit(client: Socket, roomId: string): void {
    this.logger.log(`Starting Game for room id ${roomId}`)
    const payload = {}
    this.server.to(roomId).emit(GameEvents.ON_STARTED, payload)
  }

  afterInit(server: Server) {
    this.logger.log('Init')
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }
}