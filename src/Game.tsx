import { useEffect, useState } from "react";
import { Flags } from "./components/Flags";
import { countries as countryData } from "./data/countries";
import styled from "styled-components";
import { Capitals } from "./components/Capitals";
import { Counter } from "./components/Counter";
import type { GameMode } from "./App";
import { GhostButton, Kbd } from "./components/ui";
import { ArrowRightIcon } from "./components/icons";

export interface Country {
  id: number;
  country: string;
  imagePath: string;
  capital: string;
}

export interface Guessed {
  flag: boolean;
  capital: boolean;
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 20px 16px;
  border-bottom: 1px solid var(--rule);
`;

const Wordmark = styled.p`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  white-space: nowrap;

  em {
    font-style: italic;
    font-weight: 400;
    color: var(--sea);
  }

  @media (max-width: 560px) {
    display: none;
  }
`;

const GameContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: clamp(16px, 3vh, 28px) 16px 32px;
`;

/* Sits above the flag so it never moves as feedback appears below */
const Shortcuts = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;
  font-size: 0.85rem;
  color: var(--ink-soft);

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  @media (hover: none) {
    display: none;
  }
`;

interface Props {
  gameMode: GameMode;
}

export function Game({ gameMode }: Props) {
  const [countries, setCountries] = useState<Country[]>([...countryData]);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(
    countries[Math.floor(Math.random() * countries.length)],
  );
  const [guessed, setGuessed] = useState<Guessed>({
    flag: !gameMode.flag,
    capital: !gameMode.capital,
  });
  const [round, setRound] = useState(0);
  const [capitalOptionsHidden, setCapitalOptionsHidden] =
    useState<boolean>(false);

  function getNextCountry() {
    if (countries.length === 0) {
      setCurrentCountry(null);
      return;
    }

    const random = countries[Math.floor(Math.random() * countries.length)];
    setCurrentCountry(random);

    setGuessed({
      flag: !gameMode.flag,
      capital: !gameMode.capital,
    });

    setRound((r) => r + 1);
  }

  function removeCountry() {
    if (!currentCountry) return;

    if (guessed.flag && guessed.capital) {
      setCountries((prev) => prev.filter((c) => c.id !== currentCountry.id));
    }
  }

  useEffect(() => {
    if (guessed.flag && guessed.capital) {
      removeCountry();
    }
  }, [guessed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        getNextCountry();
        setCapitalOptionsHidden(false);
      } else if (event.key === "ArrowDown" && guessed.capital) {
        setCapitalOptionsHidden(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [getNextCountry]);

  return (
    <Page>
      <TopBar>
        <Wordmark>
          Fun with <em>Flags</em>
        </Wordmark>
        <Counter countries={countries} />
        <GhostButton
          type="button"
          onClick={() => {
            getNextCountry();
            setCapitalOptionsHidden(false);
          }}
        >
          Next
          <ArrowRightIcon />
        </GhostButton>
      </TopBar>
      <GameContainer>
        {currentCountry !== null && (
          <Shortcuts aria-label="Keyboard shortcuts">
            <span>
              <Kbd>Enter</Kbd> guess
            </span>
            <span>
              <Kbd>F2</Kbd> reveal
            </span>
            <span>
              <Kbd>1</Kbd>–<Kbd>4</Kbd> pick capital
            </span>
            <span>
              <Kbd>→</Kbd> next flag
            </span>
          </Shortcuts>
        )}
        <Flags
          key={`${currentCountry?.id}-${round}`}
          countries={countries}
          currentCountry={currentCountry}
          guessed={guessed}
          setGuessed={setGuessed}
          gameMode={gameMode}
        />
        {guessed.flag && currentCountry !== null && (
          <Capitals
            key={`${currentCountry.capital}-${round}`}
            currentCountry={currentCountry}
            guessed={guessed}
            setGuessed={setGuessed}
            gameMode={gameMode}
            capitalOptionsHidden={capitalOptionsHidden}
          />
        )}
      </GameContainer>
    </Page>
  );
}
