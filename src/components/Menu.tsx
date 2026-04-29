import styled from "styled-components";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface Props {
  onStartGame: () => void;
}

export function Menu({ onStartGame }: Props) {
  return (
    <MenuContainer>
      <h1>Title</h1>
      <p>Select game mode</p>
      <button onClick={onStartGame}>Start</button>
    </MenuContainer>
  );
}
