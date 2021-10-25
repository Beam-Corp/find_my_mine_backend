export enum GameEvents {
  // client to server
  START = 'start-game',
  SELECT_BLOCK = 'select-block',
  TIME_UP = 'time-up',
  END_GAME = 'end-game',

  // server to client
  ON_STARTED = 'on-started',
  ON_SELECTED = 'on-selected',
  ON_TIME_UP = 'on-time-up',
  ON_GAME_END = 'on-game-end',
}

export interface GameState {
  roomId: string
  gridState: number[][]
  scoreState: number[]
  playerTurn: number
}

export interface GameStartPayload {
  gridState: number[][]
  playerTurn: number
}
