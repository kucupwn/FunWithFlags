import { useEffect, useState } from "react";
import styled from "styled-components";
import { countries as countryData } from "./countries";

interface Country {
  id: number;
  country: string;
  imagePath: string;
  capital: string;
}

const FlagSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-self: center;
  gap: 1rem;
`;

const FlagContainer = styled.div`
  max-width: 500px;
  max-height: 400px;
`;

export function Flags() {
  const [currentFlag, setCurrentFlag] = useState<Country | null>(null);
  const [guess, setGuess] = useState<string>("");

  useEffect(() => {
    const random = countryData[Math.floor(Math.random() * countryData.length)];
    setCurrentFlag(random);
  }, []);

  return (
    <FlagSection>
      <FlagContainer>
        {currentFlag && (
          <img src={currentFlag.imagePath} alt={currentFlag.country} />
        )}
      </FlagContainer>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <button>Guess</button>
    </FlagSection>
  );
}
