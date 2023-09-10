function standard2v2(players: any[]) {
  return [
    {
      turn: 1,
      player: players[0],
      selection: 0,
    },
    {
      turn: 2,
      player: players[1],
      selection: 0,
    },
    {
      turn: 3,
      player: players[1],
      selection: 0,
    },
    {
      turn: 4,
      player: players[0],
      selection: 0,
    },
    {
      turn: 5,
      player: players[0],
      selection: 1,
    },
    {
      turn: 6,
      player: players[1],
      selection: 1,
    },
    {
      turn: 7,
      player: players[1],
      selection: 1,
    },
    {
      turn: 8,
      player: players[0],
      selection: 1,
    },
  ];
}

export default standard2v2;
