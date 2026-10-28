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
    if (!gameMode.flag && !gameMode.capital) {
      return;
    }

    setGameStarted(true);
  }

  return (
    <>
      {!gameStarted && (
        <Menu setGameMode={setGameMode} onStartGame={startGame} />
      )}
      {gameStarted && <Game gameMode={gameMode} />}
    </>
  );
}
