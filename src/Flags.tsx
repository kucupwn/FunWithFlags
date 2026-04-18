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

  @media (max-width: 768px) {
    max-width: 300px;
    max-height: 200px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export function Flags() {
  const [currentFlag, setCurrentFlag] = useState<Country | null>(null);
  const [guess, setGuess] = useState<string>("");
  const [flagGuessed, setFlagGuessed] = useState<boolean>(false);

  function handleGuess() {
    if (guess.toLowerCase() === currentFlag?.country.toLowerCase()) {
      setFlagGuessed(true);
    }
  }

  useEffect(() => {
    const random = countryData[Math.floor(Math.random() * countryData.length)];
    setCurrentFlag(random);
  }, []);

  return (
    <FlagSection>
      <FlagContainer>
        {currentFlag && (
          <Image src={currentFlag.imagePath} alt={currentFlag.country} />
        )}
      </FlagContainer>
      {!flagGuessed ? (
        <>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button onClick={handleGuess}>Guess</button>
        </>
      ) : (
        <h2>{currentFlag?.country}</h2>
      )}
    </FlagSection>
  );
}
