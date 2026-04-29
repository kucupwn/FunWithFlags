import { useState } from "react";
import { Game } from "./Game";
import { Menu } from "./components/Menu";

export interface GameMode {
  flag: boolean;
  capital: boolean;
}

export function App() {
  const [gameMode, setGameMode] = useState<GameMode>({
    flag: true,
    capital: true,
  });
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  function startGame() {
    setGameStarted(true);
  }

  return (
    <>
      {!gameStarted && <Menu onStartGame={startGame} />}
      {gameStarted && <Game />}
    </>
  );
}
