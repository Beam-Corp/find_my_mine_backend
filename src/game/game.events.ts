export enum GameEvents {
  // client to server
  START = 'start-game',
  SELECT_BLOCK = 'select-block',
  TIME_UP = 'time-up',
  END_GAME = 'end-game',
  SURRENDER = 'surrender',
  RESTART = 'restart',
  SEND_MESSAGE = 'send-message',

  // server to client
  ON_STARTED = 'on-started',
  ON_SELECTED = 'on-selected',
  ON_TIME_UP = 'on-time-up',
  ON_GAME_END = 'on-game-end',
  ON_SURRENDER = 'on-surrender',
  ON_RESTART = 'on-restart',
  ON_SEND_MESSAGE = 'on-send-message',
}

export interface GameState {
  roomId: string
  gridState: number[][]
  scoreState: number[]
  playerTurn: number
  clickNumber: number
}

export interface SurrenderState {
  roomId: string
  surrenderer: number
}

export interface GameStartSettings {
  roomId: string
  gridSize: number
  bombNumber: number
  initialTimer: number
}

export interface GameStartPayload {
  gridState: number[][]
  playerTurn: number
  initialTimer: number
}

export interface MessagePayload {
  roomId: string
  playerNumber: string
  message: string
}
