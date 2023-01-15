import { User } from "./types"

let users: User[] = []

export function getAllUsers() {
  return users
}

export function userJoin(user: User) {
  users.push(user)
}

export function getUser(id: string) {
  return users.find((user: User) => user.id === id)
}

export function getAllUsersInRoom(roomId: string){
  return users.filter((user: User) => user.roomId === roomId)
}

export function getHostInRoom(roomId: string){
  return users.find((user: User) => user.roomId === roomId && user.isHost)
}

export function getAllPlayersInRoom(roomId: string){
  return users.filter((user: User) => user.roomId === roomId && !user.isHost)
}

export function removeUser(id: string) {
  users = users.filter((user: User) => user.id !== id)
}
