import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { User, Character, Sequence } from "./types";
import { userJoin, getUser, getAllPlayersInRoom, removeUser } from "./users";
import {
  createGame,
  getGame,
  getPlayers,
  getTurn,
  increasePointer,
  removeGame,
  resetSequence,
  setPlayers,
  setSequence,
} from "./games";
import type { Request, Response } from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.sendStatus(200);
});

io.on("connection", (socket) => {
  socket.removeAllListeners();
  socket.on("createRoom", (data: { name: string }) => {
    const user: User = {
      id: socket.id,
      name: data.name,
      roomId: uuidv4(),
      isHost: true,
    };
    userJoin(user);
    socket.join(user.roomId);
    socket.emit("setUser", user);
    socket.emit("getRoomId", user.roomId);
  });
  socket.on("joinRoom", (data: { name: string; roomId: string }) => {
    const user: User = {
      id: socket.id,
      name: data.name,
      roomId: data.roomId,
      isHost: false,
    };
    userJoin(user);
    socket.join(user.roomId);
    socket.emit("getRoomId", user.roomId);
    socket.emit("setUser", user);
    const players = getAllPlayersInRoom(user.roomId);
    io.in(user.roomId).emit("getAllPlayersInRoom", players);
  });

  socket.on("rejoinRoom", (user?: User) => {
    if (user) {
      const userExists = getUser(socket.id);
      if (!userExists) {
        user.id = socket.id;
        userJoin(user);
        socket.join(user.roomId);
        socket.emit("setUser", user);
        const players = getAllPlayersInRoom(user.roomId);
        io.in(user.roomId).emit("getAllPlayersInRoom", players);
      }
    }
  });

  socket.on("getAllPlayersInRoom", (roomId: string) => {
    const players = getAllPlayersInRoom(roomId);
    io.in(roomId).emit("getAllPlayersInRoom", players);
  });

  socket.on("getUser", () => {
    const user = getUser(socket.id);
    socket.emit("setUser", user);
  });

  socket.on("getAllPlayersInGame", (roomId: string) => {
    const players = getPlayers(roomId);
    socket.emit("getAllPlayersInGame", players);
  });

  let time: number = null;
  let timeHandler: ReturnType<typeof setInterval>;

  socket.on("startGame", (data: any) => {
    createGame(data);
    resetSequence(data.roomId);
    if (data.firstPick) {
      data.players = [data.players[1], data.players[0]];
    }
    setPlayers(data.roomId, data.players);
    const selection = setSequence(data.roomId, data.gameType, data.mode);
    data.game = getGame(data.roomId);
    data.game.mode = data.mode;
    data.noOfPicks = Number(selection.noOfPicks);
    data.noOfBans = Number(selection.noOfBans);
    io.to(data.players[0].id).emit("setPlayer", 0);
    io.to(data.players[1].id).emit("setPlayer", 1);
    io.in(data.roomId).emit("startGame", data);
  });

  socket.on("draftStart", (roomId: string) => {
    io.in(roomId).emit("draftStart");
  });

  socket.on("nextTurn", (roomId: string) => {
    clearInterval(timeHandler);
    increasePointer(roomId);
    const turn = getTurn(roomId);
    if (turn) {
      io.in(roomId).emit("announceTurn", turn);
      io.to(turn.player.id).emit("select", turn.selection);
    } else {
      io.in(roomId).emit("gameCompleted");
    }
  });

  socket.on("stopTimer", () => {
    clearInterval(timeHandler);
  });

  socket.on("startTimer", (roomId: string) => {
    const game = getGame(roomId);
    if (game.withTimer) {
      const turn: Sequence | boolean = getTurn(roomId);
      if (turn) {
        time = game.time;
        timeHandler = setInterval(() => {
          time--;
          io.to(roomId).emit("getTime", time);
          if (time === 0) {
            clearInterval(timeHandler);
            io.to(turn.player.id).emit("noPick", turn);
          }
        }, 1000);
      }
    }
  });

  socket.on(
    "removeCharacterFromPanel",
    (data: { character: Character; roomId: string }) => {
      io.in(data.roomId).emit("removeCharacterFromPanel", data);
    }
  );

  socket.on("setNewSelection", (data: any) => {
    io.in(data.roomId).emit("setNewSelection", data);
  });

  socket.on("goBack", (roomId: string) => {
    removeGame(roomId);
    io.in(roomId).emit("goBack");
  });

  socket.on("removeUser", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(user.id);
    }
  });

  socket.on("chat", (data: any) => {
    socket.broadcast.emit("chat", data);
  });

  socket.on("setSheetData", ({ sheetData, roomId, colReference }) => {
    io.in(roomId).emit("setSheetData", { sheetData, colReference });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(user.id);
      socket.leave(user.roomId);
      const players = getAllPlayersInRoom(user.roomId);
      io.to(user.roomId).emit("getAllPlayersInRoom", players);
      io.to(user.roomId).emit("disconnected", user.name);
    }
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
