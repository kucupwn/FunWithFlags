import { useState } from "react";
import styled from "styled-components";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface GameMode {
  flag: boolean;
  capital: boolean;
}

export function Menu() {
  const [gameMode, setGameMode] = useState<GameMode>({
    flag: true,
    capital: true,
  });

  return (
    <MenuContainer>
      <h1>Title</h1>
      <p>Select game mode</p>
    </MenuContainer>
  );
}
