import { useEffect, useState } from "react";
import { Flags } from "./components/Flags";
import { countries as countryData } from "./data/countries";
import styled from "styled-components";
import { Capitals } from "./components/Capitals";
import { Counter } from "./components/Counter";

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

export function App() {
  const [countries, setCountries] = useState<Country[]>([...countryData]);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(
    countries[Math.floor(Math.random() * countries.length)],
  );
  const [guessed, setGuessed] = useState<Guessed>({
    flag: false,
    capital: false,
  });
  const [round, setRound] = useState(0);

  function getNext() {
    if (countries.length === 0) {
      setCurrentCountry(null);
      return;
    }

    const random = countries[Math.floor(Math.random() * countries.length)];
    setCurrentCountry(random);

    setGuessed({
      flag: false,
      capital: false,
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
        getNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [getNext]);

  return (
    <GameContainer>
      <TopWrapper>
        <Counter countries={countries} />
        <NextButton onClick={getNext}>Next</NextButton>
      </TopWrapper>
      <Flags
        key={`${currentCountry?.id}-${round}`}
        countries={countries}
        currentCountry={currentCountry}
        setGuessed={setGuessed}
      />
      {guessed.flag && currentCountry !== null && (
        <Capitals
          currentCountry={currentCountry}
          guessed={guessed}
          setGuessed={setGuessed}
        />
      )}
    </GameContainer>
  );
}
