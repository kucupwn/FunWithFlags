import { useEffect, useState } from "react";
import styled from "styled-components";
import { countries as countryData } from "./countries";
import { useSpotr } from "spotr/react";

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
  const [currentIndex, setCurrentIndex] = useState<number>(getRandomIndex());
  const [guess, setGuess] = useState<string>("");
  const [flagGuessed, setFlagGuessed] = useState<boolean>(false);

  const spotr = useSpotr({
    collection: countryData,
    fields: [{ name: "country", weight: 0.75 }],
  });
  const stopWords = ["and", "of", "the"];

  function normalizeName(name: string) {
    return name
      .toLowerCase()
      .split(" ")
      .filter((word) => !stopWords.includes(word));
  }

  function handleGuess() {
    if (!currentFlag || !guess) return;

    const countryWords = normalizeName(currentFlag.country);

    const res = spotr.query(guess);
    const best = res.results.slice(0, 5);

    const match = countryWords.some((countryWord) =>
      best.some(
        (r) =>
          r &&
          r.score >= 0.75 &&
          normalizeName(r.item.country).includes(countryWord),
      ),
    );

    if (match) {
      setFlagGuessed(true);
    }
  }

  function getRandomIndex() {
    return Math.floor(Math.random() * countryData.length);
  }

  function getNext() {
    const newIndex = getRandomIndex();
    setCurrentIndex(newIndex);
    setCurrentFlag(countryData[currentIndex]);
    setGuess("");
    setFlagGuessed(false);
  }

  useEffect(() => {
    setCurrentFlag(countryData[currentIndex]);
  }, [currentIndex]);

  return (
    <FlagSection>
      <button onClick={getNext}>Next</button>
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
