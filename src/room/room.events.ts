export enum RoomEvents {
  CREATE = 'create',
  ON_CREATE = 'on-create',
  LEAVE = 'leave',
  ON_LEAVE = 'on-leave',
  JOIN = 'join',
  ON_JOIN = 'on-join',
  INTRODUCE = 'introduce',
  GET_PLAYERS = 'get-players',
  ON_GET_PLAYERS = 'on-get-players',
}
export interface Introduction {
  username: string
  roomId: string
}
