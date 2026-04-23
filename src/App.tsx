import { useEffect, useState } from "react";
import { Flags } from "./Flags";
import { countries as countryData } from "./countries";
import styled from "styled-components";

export interface Country {
  id: number;
  country: string;
  imagePath: string;
  capital: string;
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export function App() {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(getRandomIndex());

  function getRandomIndex() {
    return Math.floor(Math.random() * countryData.length);
  }

  function getNext() {
    const newIndex = getRandomIndex();
    setCurrentIndex(newIndex);
    setCurrentCountry(countryData[newIndex]);
  }

  useEffect(() => {
    setCurrentCountry(countryData[currentIndex]);
  }, [currentIndex]);

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
        currentCountry={currentCountry}
        currentIndex={currentIndex}
      />
    </GameContainer>
  );
}
