import { BadRequestException, Logger } from "@nestjs/common";
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  WsException,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { RoomEvents } from "./room.events";
import { v4 as uuidv4 } from "uuid";

@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
    }
    throw new WsException("cannot join this room");
  }
  @SubscribeMessage(RoomEvents.LEAVE)
  async handleRoomDisconnection(client: Socket, id: string): Promise<void> {
    if (client.rooms.has(id)) await client.leave(id);
  }
  // @SubscribeMessage(RoomEvents.GET_CHAT)
  // handleGetRoomChat(client:Socket, message:string) {
  //     this.server.to(Array.from(client.rooms)).emit(RoomEvents.SEND_CHAT, message)
  // }
  afterInit(server: Server) {
    this.logger.log("Init");
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
