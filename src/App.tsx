import { useEffect, useState } from "react";
import { Flags } from "./Flags";
import { countries as countryData } from "./countries";
import styled from "styled-components";
import { Capitals } from "./Capitals";

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

export function App() {
  const [countries, setCountries] = useState<Country[]>([...countryData]);
  const [currentCountry, setCurrentCountry] = useState<Country>(
    countries[Math.floor(Math.random() * countries.length)],
  );
  const [guessed, setGuessed] = useState<Guessed>({
    flag: false,
    capital: false,
  });

  function getNext() {
    if (countries.length === 0) return;

    const random = countries[Math.floor(Math.random() * countries.length)];
    setCurrentCountry(random);

    setGuessed({
      flag: false,
      capital: false,
    });
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
      <button onClick={getNext}>Next</button>
      <Flags
        key={currentCountry?.id}
        countries={countries}
        currentCountry={currentCountry}
        setGuessed={setGuessed}
      />
      {guessed.flag && (
        <Capitals
          currentCountry={currentCountry}
          guessed={guessed}
          setGuessed={setGuessed}
        />
      )}
    </GameContainer>
  );
}
