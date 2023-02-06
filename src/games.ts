import { Game, Sequence, User } from "./types"

let games: Game[] = []

export function createGame(data: any) {
  const { autoban, roomId, withTimer, time } = data
  const game = games.find((game: Game) => game.roomId === data.roomId)
  if (!game) {
    games.push({
      autoban,
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

export function setSequence(roomId: string, gameType: string, mode: number) {
  let sequence: Sequence[] = []
  const players = getPlayers(roomId)
  if (gameType === 'std') {
    switch (Number(mode)) {
      case 1:
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
      case 2:
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
      case 3:
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
            selection: 0
          },
          {
            turn: 6,
            player: players[1],
            selection: 0
          },
          {
            turn: 7,
            player: players[0],
            selection: 1
          },
          {
            turn: 8,
            player: players[1],
            selection: 1
          },
          {
            turn: 9,
            player: players[1],
            selection: 1
          },
          {
            turn: 10,
            player: players[0],
            selection: 1
          },
          {
            turn: 11,
            player: players[0],
            selection: 1
          },
          {
            turn: 12,
            player: players[1],
            selection: 1
          },
        ]
        break
      case 4:
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
  } else if (gameType === 'abyss') {
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
        player: players[0],
        selection: 1
      },
      {
        turn: 10,
        player: players[1],
        selection: 1
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
      },
      {
        turn: 13,
        player: players[1],
        selection: 0
      },
      {
        turn: 14,
        player: players[0],
        selection: 0
      },
      {
        turn: 15,
        player: players[1],
        selection: 1
      },
      {
        turn: 16,
        player: players[0],
        selection: 1
      },
      {
        turn: 17,
        player: players[0],
        selection: 1
      },
      {
        turn: 18,
        player: players[1],
        selection: 1
      },
      {
        turn: 19,
        player: players[1],
        selection: 1
      },
      {
        turn: 20,
        player: players[0],
        selection: 1
      },
      {
        turn: 21,
        player: players[0],
        selection: 1
      },
      {
        turn: 22,
        player: players[1],
        selection: 1
      },
    ]
  }
  games = games.map((game: Game) => {
    if (game.roomId === roomId) {
      game.sequence = sequence
    }
    return game
  })
}
