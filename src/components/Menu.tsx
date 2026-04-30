import styled from "styled-components";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const SettingRow = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-between;
`;

const RadioWrapper = styled.div`
  display: flex;
  gap: 2rem;
`;

interface Props {
  onStartGame: () => void;
}

export function Menu({ onStartGame }: Props) {
  return (
    <MenuContainer>
      <h1>Title</h1>
      <p>Select game mode</p>
      <SettingRow>
        <span>Flag</span>
        <RadioWrapper>
          <input type="radio" name="flag" />
          <input type="radio" name="flag" />
        </RadioWrapper>
      </SettingRow>
      <SettingRow>
        <span>Capital</span>
        <RadioWrapper>
          <input type="radio" name="capital" />
          <input type="radio" name="capital" />
        </RadioWrapper>
      </SettingRow>
      <button onClick={onStartGame}>Start</button>
    </MenuContainer>
  );
}
