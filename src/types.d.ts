declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'test' | 'dev' | 'prod';
      PORT: string;
      SECRET: string;
    }
  }
}

export type User = {
  id: string
  name: string
  roomId: string
  isHost: boolean
}

export type Sequence = {
  turn: number
  player: User
  selection: number
}

export type Game = {
  roomId: string
  withTimer: boolean
  time: number
  pointer: number
  players: User[]
  sequence: Sequence[]
}

export type Character = {
  name: string
  vision: string
  image: string
  thumbnail: string
  flash?: string
}