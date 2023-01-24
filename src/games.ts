import { Game, Sequence, User } from "./types"

let games: Game[] = []

export function createGame(data: any) {
  const { roomId, withTimer, time } = data
  const game = games.find((game: Game) => game.roomId === data.roomId)
  if (!game) {
    games.push({
      roomId: roomId,
      withTimer: withTimer === 'Yes',
      time: time,
      pointer: -1,
      players: [],
      sequence: []
    })
  }
}

export function getGame(roomId: string) {
  return games.find((game: Game) => game.roomId === roomId)
}

export function removeGame(roomId: string) {
  games = games.filter((game: Game) => game.roomId !== roomId)
}

export function resetSequence(roomId: string) {
  games = games.map((game) => {
    if (game.roomId === roomId) {
      game.sequence = []
      game.pointer = -1
    }
    return game
  })
}

export function setPlayers(roomId: string, players: User[]) {
  games = games.map((game: Game) => {
    if (game.roomId === roomId) {
      game.players = players
    }
    return game
  })
}

export function getPlayers(roomId: string) {
  return games.find((game: Game) => game.roomId === roomId)?.players
}

export function increasePointer(roomId: string) {
  games = games.map((game: Game) => {
    if (game.roomId === roomId) {
      game.pointer++
    }
    return game
  })
}

export function getTurn(roomId: string) {
  const turn = games.find((game: Game) => game.roomId === roomId)
  if (turn?.pointer < turn?.sequence.length)
    return turn.sequence[turn.pointer]
  return false
}

/*
  0 = ban
  1 = pick
*/

export function setSequence(roomId: string, mode: string) {
  let sequence: Sequence[] = []
  const players = getPlayers(roomId)
  switch (mode) {
    case '1v1':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[0],
          selection: 1
        },
        {
          turn: 4,
          player: players[1],
          selection: 1
        }
      ]
      break
    case '2v2':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[1],
          selection: 0
        },
        {
          turn: 4,
          player: players[0],
          selection: 0
        },
        {
          turn: 5,
          player: players[0],
          selection: 1
        },
        {
          turn: 6,
          player: players[1],
          selection: 1
        },
        {
          turn: 7,
          player: players[1],
          selection: 1
        },
        {
          turn: 8,
          player: players[0],
          selection: 1
        }
      ]
      break
    case '3v3':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[1],
          selection: 0
        },
        {
          turn: 4,
          player: players[0],
          selection: 0
        },
        {
          turn: 5,
          player: players[0],
          selection: 1
        },
        {
          turn: 6,
          player: players[1],
          selection: 1
        },
        {
          turn: 7,
          player: players[1],
          selection: 1
        },
        {
          turn: 8,
          player: players[0],
          selection: 1
        },
        {
          turn: 9,
          player: players[1],
          selection: 0
        },
        {
          turn: 10,
          player: players[0],
          selection: 0
        },
        {
          turn: 11,
          player: players[1],
          selection: 1
        },
        {
          turn: 12,
          player: players[0],
          selection: 1
        }
      ]
      break
    case '4v4':
      sequence = [
        {
          turn: 1,
          player: players[0],
          selection: 0
        },
        {
          turn: 2,
          player: players[1],
          selection: 0
        },
        {
          turn: 3,
          player: players[1],
          selection: 0
        },
        {
          turn: 4,
          player: players[0],
          selection: 0
        },
        {
          turn: 5,
          player: players[0],
          selection: 1
        },
        {
          turn: 6,
          player: players[1],
          selection: 1
        },
        {
          turn: 7,
          player: players[1],
          selection: 1
        },
        {
          turn: 8,
          player: players[0],
          selection: 1
        },
        {
          turn: 9,
          player: players[1],
          selection: 0
        },
        {
          turn: 10,
          player: players[0],
          selection: 0
        },
        {
          turn: 11,
          player: players[0],
          selection: 0
        },
        {
          turn: 12,
          player: players[1],
          selection: 0
        },
        {
          turn: 13,
          player: players[1],
          selection: 1
        },
        {
          turn: 14,
          player: players[0],
          selection: 1
        },
        {
          turn: 15,
          player: players[0],
          selection: 1
        },
        {
          turn: 16,
          player: players[1],
          selection: 1
        }
      ]
      break
  }
  games = games.map((game: Game) => {
    if (game.roomId === roomId) {
      game.sequence = sequence
    }
    return game
  })
}
