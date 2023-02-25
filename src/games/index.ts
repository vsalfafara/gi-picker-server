import { Game, Sequence, User } from "../types"
import abyss from "./abyss/abyss"
import amberGames from "./amberGames"
import kingOfTeyvat from "./kingOfTeyvat"
import standard1v1 from "./standard/1v1"
import standard2v2 from "./standard/2v2"
import standard3v3 from "./standard/3v3"
import standard4v4 from "./standard/4v4"

let games: Game[] = []

export function createGame(data: any) {
  const { autoban, roomId, withTimer, time } = data
  const game = games.find((game: Game) => game.roomId === data.roomId)
  if (!game) {
    games.push({
      autoban,
      roomId: roomId,
      withTimer: withTimer === "Yes",
      time: time,
      pointer: -1,
      players: [],
      sequence: [],
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
  if (turn?.pointer < turn?.sequence.length) return turn.sequence[turn.pointer]
  return false
}

/*
  0 = ban
  1 = pick
*/

export function setSequence(roomId: string, gameType: string, mode: string) {
  let sequence: Sequence[] = []
  const players = getPlayers(roomId)
  if (gameType === "std") {
    switch (mode) {
      case "1v1":
        sequence = standard1v1(players)
        break
      case "2v2":
        sequence = standard2v2(players)
        break
      case "3v3":
        sequence = standard3v3(players)
        break
      case "4v4":
        sequence = standard4v4(players)
        break
      case "amberGames":
        sequence = amberGames(players)
        break
      case "kingOfTeyvat":
        sequence = kingOfTeyvat(players)
        break
    }
  } else if (gameType === "abyss") {
    sequence = abyss(players)
  }
  games = games.map((game: Game) => {
    if (game.roomId === roomId) {
      game.sequence = sequence
    }
    return game
  })

  let selections = {
    noOfPicks: 0,
    noOfBans: 0,
  }

  sequence.forEach((turn: any) => {
    if (turn.selection) {
      selections.noOfPicks++
    } else {
      selections.noOfBans++
    }
  })

  selections.noOfPicks = selections.noOfPicks / 2
  selections.noOfBans = selections.noOfBans / 2

  return selections
}
