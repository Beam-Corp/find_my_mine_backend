import { Logger } from "@nestjs/common";
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  WsException,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { RoomEvents } from "./room.events";
import { v4 as uuidv4 } from "uuid";

@WebSocketGateway({ cors: true })
export class RoomGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("RoomGateway");

  @SubscribeMessage(RoomEvents.CREATE)
  async handleRoomCreation(client: Socket): Promise<void> {
    const roomId = uuidv4().substring(0, 4);
    if (client.rooms.size !== 0) client.rooms.clear();
    await client.join(roomId);
    this.server.to(roomId).emit(RoomEvents.ROOM_ID, roomId);
  }
  @SubscribeMessage(RoomEvents.JOIN)
  async handleRoomJoin(client: Socket, id: string): Promise<void> {
    const currentRooms = this.server.sockets.adapter.rooms;
    if (client.rooms.size !== 0) client.rooms.clear();
    if (currentRooms.has(id) && currentRooms.get(id).size < 2) {
      await client.join(id);
      this.logger.log(`${client.id} joined room ${id}`)
    }
    throw new WsException(`cannot join room ${id}`);
  }
  @SubscribeMessage(RoomEvents.LEAVE)
  async handleRoomDisconnection(client: Socket, id: string): Promise<void> {
    if (client.rooms.has(id)){
      await client.leave(id);
      this.logger.log(`${client.id} leaves room ${id}`)
    }
  }
}
