export enum RoomEvents {
  CREATE = "create",
  ON_CREATE = "on-create",
  LEAVE = "leave",
  ON_LEAVE = "on-leave",
  JOIN = "join",
  ON_JOIN = 'on-join',
  INTRODUCE = "introduce"
}
export interface Introduction {
  username: string,
  roomId: string
}
