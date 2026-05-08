import { useEffect, useState } from "react";
import { Flags } from "./components/Flags";
import { countries as countryData } from "./data/countries";
import styled from "styled-components";
import { Capitals } from "./components/Capitals";
import { Counter } from "./components/Counter";
import type { GameMode } from "./App";

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

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const NextButton = styled.button`
  width: 80px;
  font-size: 20px;
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 500px;
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
    <GameContainer>
      <TopWrapper>
        <Counter countries={countries} />
        <NextButton onClick={getNextCountry}>Next</NextButton>
      </TopWrapper>
      <Flags
        key={`${currentCountry?.id}-${round}`}
        countries={countries}
        currentCountry={currentCountry}
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
  );
}
