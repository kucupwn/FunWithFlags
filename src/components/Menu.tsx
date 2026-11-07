import { useState, type Dispatch, type SetStateAction } from "react";
import styled from "styled-components";
import type { GameMode } from "../App";
import { countries } from "../data/countries";
import { PrimaryButton } from "./ui";
import { ArrowRightIcon, CompassIcon } from "./icons";

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px 16px;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Masthead = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  text-align: center;

  svg {
    width: 36px;
    height: 36px;
    margin: 0 auto;
    color: var(--brass);
  }
`;

const Title = styled.h1`
  font-size: clamp(2.75rem, 9vw, 4.25rem);
  line-height: 0.95;
  letter-spacing: -0.025em;
  font-variation-settings: "opsz" 144;

  em {
    font-style: italic;
    font-weight: 400;
    color: var(--sea);
  }
`;

const Lede = styled.p`
  text-wrap: balance;
  color: var(--ink-soft);
  font-size: 1.05rem;
`;

const Fieldset = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
  border-top: 1px solid var(--rule);
`;

const Legend = styled.legend`
  float: left;
  width: 100%;
  padding: 1.1rem 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
`;

const Option = styled.label`
  clear: both;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--rule);
  cursor: pointer;
`;

const OptionText = styled.span`
  flex: 1;
  display: flex;
  flex-direction: column;

  strong {
    font-weight: 600;
  }

  span {
    color: var(--ink-soft);
    font-size: 0.925rem;
  }
`;

const Switch = styled.button<{ $on: boolean }>`
  position: relative;
  flex: none;
  width: 48px;
  height: 28px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid ${({ $on }) => ($on ? "var(--sea)" : "var(--rule-strong)")};
  background: ${({ $on }) => ($on ? "var(--sea)" : "var(--paper-deep)")};
  transition:
    background-color 200ms var(--ease-out),
    border-color 200ms var(--ease-out);

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--plate);
    box-shadow: 0 1px 2px rgba(35, 32, 27, 0.3);
    transform: translateX(${({ $on }) => ($on ? "20px" : "0")});
    transition: transform 240ms var(--ease-out);
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  ${PrimaryButton} {
    width: 100%;
    height: 52px;
    font-size: 1.05rem;
  }
`;

const Hint = styled.p`
  min-height: 1.5em;
  font-size: 0.9rem;
  color: var(--wrong);
`;

interface Props {
  setGameMode: Dispatch<SetStateAction<GameMode>>;
  onStartGame: () => void;
}

export function Menu({ setGameMode, onStartGame }: Props) {
  const [mode, setMode] = useState<GameMode>({ flag: true, capital: true });
  const nothingSelected = !mode.flag && !mode.capital;

  function toggle(key: keyof GameMode) {
    const next = { ...mode, [key]: !mode[key] };
    setMode(next);
    setGameMode(next);
  }

  return (
    <Page>
      <Sheet>
        <Masthead>
          <CompassIcon />
          <Title>
            Fun with <em>Flags</em>
          </Title>
          <Lede>
            {countries.length} countries and territories. How many can you
            name?
          </Lede>
        </Masthead>

        <Fieldset>
          <Legend>Rounds</Legend>
          <Option>
            <OptionText>
              <strong>Flags</strong>
              <span>Name the country from its flag</span>
            </OptionText>
            <Switch
              type="button"
              role="switch"
              aria-checked={mode.flag}
              $on={mode.flag}
              onClick={() => toggle("flag")}
            />
          </Option>
          <Option>
            <OptionText>
              <strong>Capitals</strong>
              <span>Pick the capital from four choices</span>
            </OptionText>
            <Switch
              type="button"
              role="switch"
              aria-checked={mode.capital}
              $on={mode.capital}
              onClick={() => toggle("capital")}
            />
          </Option>
        </Fieldset>

        <Footer>
          <PrimaryButton
            type="button"
            onClick={onStartGame}
            disabled={nothingSelected}
          >
            Start the quiz
            <ArrowRightIcon />
          </PrimaryButton>
          <Hint role="status">
            {nothingSelected ? "Turn on at least one round to play." : ""}
          </Hint>
        </Footer>
      </Sheet>
    </Page>
  );
}
