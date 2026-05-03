import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import styled from "styled-components";
import type { GameMode } from "../App";

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

const SettingsHeader = styled.p`
  font-weight: bold;
  font-size: 18px;
`;

const StartButton = styled.button`
  font-size: 20px;
`;

interface Props {
  setGameMode: Dispatch<SetStateAction<GameMode>>;
  onStartGame: () => void;
}

type ModeSwitch = "on" | "off";

export function Menu({ setGameMode, onStartGame }: Props) {
  const [flagMode, setFlagMode] = useState<ModeSwitch>("on");
  const [capitalMode, setCapitalMode] = useState<ModeSwitch>("on");

  function handleSwitch(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "flag") {
      setFlagMode(value as ModeSwitch);
      setGameMode((prev) => ({
        ...prev,
        flag: value === "on",
      }));
    }

    if (name === "capital") {
      setCapitalMode(value as ModeSwitch);
      setGameMode((prev) => ({
        ...prev,
        capital: value === "on",
      }));
    }
  }

  return (
    <MenuContainer>
      <h1>Fun with Flags</h1>
      <h2>Select game mode</h2>
      <SettingRow>
        <SettingsHeader>Property</SettingsHeader>
        <RadioWrapper>
          <SettingsHeader>Yes</SettingsHeader>
          <SettingsHeader>No</SettingsHeader>
        </RadioWrapper>
      </SettingRow>
      <SettingRow>
        <span>Flag</span>
        <RadioWrapper>
          <input
            type="radio"
            name="flag"
            value="on"
            checked={flagMode === "on"}
            onChange={(e) => handleSwitch(e)}
          />
          <input
            type="radio"
            name="flag"
            value="off"
            checked={flagMode === "off"}
            onChange={(e) => handleSwitch(e)}
          />
        </RadioWrapper>
      </SettingRow>
      <SettingRow>
        <span>Capital</span>
        <RadioWrapper>
          <input
            type="radio"
            name="capital"
            value="on"
            checked={capitalMode === "on"}
            onChange={(e) => handleSwitch(e)}
          />
          <input
            type="radio"
            name="capital"
            value="off"
            checked={capitalMode === "off"}
            onChange={(e) => handleSwitch(e)}
          />
        </RadioWrapper>
      </SettingRow>
      <StartButton onClick={onStartGame}>Start</StartButton>
    </MenuContainer>
  );
}
