import { Logger } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsException } from '@nestjs/websockets'

import { Socket, Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import { ClientState, Introduction, RoomEvents } from './room.events'
@WebSocketGateway({ cors: true })
export class RoomGateway {
  @WebSocketServer() server: Server
  private logger: Logger = new Logger('RoomGateway')

  handleDisconnect(client: Socket) {
    if (!!client.data.roomId) {
      this.server.to(client.data.roomId).emit(RoomEvents.LEAVE,client.data.username);
      client.data.roomId = ""
    }
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  handleConnection(client: Socket) {
    client.data = {} as ClientState
    this.logger.log(`Client connected: ${client.id}`)
  }
  @SubscribeMessage(RoomEvents.ON_CREATE)
  async handleRoomCreation(client: Socket): Promise<void> {
    const roomId = uuidv4().substring(0, 4)
    if (client.rooms.size !== 0) client.rooms.clear()
    await client.join(roomId)
    client.data.roomId = roomId;
    this.server.to(roomId).emit(RoomEvents.CREATE, roomId)
  }

  @SubscribeMessage(RoomEvents.ON_JOIN)
  async handleRoomJoin(client: Socket, roomId: string): Promise<void> {
    const currentRooms = this.server.sockets.adapter.rooms
    if (client.rooms.size !== 0) client.rooms.clear()
    if (currentRooms.has(roomId) && currentRooms.get(roomId).size < 2) {
      await client.join(roomId)
      client.data.roomId = roomId;
      this.logger.log(`${client.id} joined room ${roomId}`)
      this.server.to(roomId).emit(RoomEvents.JOIN, roomId)
    }
    throw new WsException(`cannot join room ${roomId}`)
  }

  @SubscribeMessage(RoomEvents.INTRODUCE)
  async handleIntroduction(client: Socket, { roomId, username }: Introduction) {
    if (!client.rooms.has(roomId) || !this.server.sockets.adapter.rooms.has(roomId)) throw new WsException(`wrong room`)
    client.data.username = username;
    await client.to(roomId).emit(RoomEvents.INTRODUCE, username)
  }

  @SubscribeMessage(RoomEvents.ON_LEAVE)
  async handleRoomDisconnection(client: Socket, { roomId, username }: Introduction): Promise<void> {
    if (client.rooms.has(roomId)) {
      await client.leave(roomId)
      await client.to(roomId).emit(RoomEvents.LEAVE, username)
      client.data.roomId = ""
      this.logger.log(`${client.id} leaves room ${roomId}`)
    }
  }
  @SubscribeMessage(RoomEvents.ON_GET_PLAYERS)
  async getConcurrentPlayers(server = this.server) {
    const currentPlayers = server?.sockets.sockets.size
    const rooms = server ? [...server.sockets.adapter.rooms.keys()].filter((roomId) => roomId.length === 4) : []
    await server?.emit(RoomEvents.GET_PLAYERS, { current: currentPlayers ?? 0, roomList: rooms })
  }
}
