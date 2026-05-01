import { useState } from "react";
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

const SettingsHeader = styled.p`
  font-weight: bold;
  font-size: 18px;
`;

interface Props {
  onStartGame: () => void;
}

type ModeSwitch = "on" | "off";

export function Menu({ onStartGame }: Props) {
  const [flagMode, setFlagMode] = useState<ModeSwitch>("on");
  const [capitalMode, setCapitalMode] = useState<ModeSwitch>("on");

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
            onChange={(e) => setFlagMode(e.target.value as ModeSwitch)}
          />
          <input
            type="radio"
            name="flag"
            value="off"
            checked={flagMode === "off"}
            onChange={(e) => setFlagMode(e.target.value as ModeSwitch)}
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
            onChange={(e) => setCapitalMode(e.target.value as ModeSwitch)}
          />
          <input
            type="radio"
            name="capital"
            value="off"
            checked={capitalMode === "off"}
            onChange={(e) => setCapitalMode(e.target.value as ModeSwitch)}
          />
        </RadioWrapper>
      </SettingRow>
      <button onClick={onStartGame}>Start</button>
    </MenuContainer>
  );
}
