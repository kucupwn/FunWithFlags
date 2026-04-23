import { useEffect, useState } from "react";
import styled from "styled-components";
import { countries as countryData } from "./countries";
import { useSpotr } from "spotr/react";
import type { Country } from "./App";

interface Props {
  currentCountry: Country | null;
  currentIndex: number;
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
  width: 300px;
  height: 200px;

  @media (max-width: 768px) {
    width: 300px;
    height: 200px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 300px;
`;

export function Flags({ currentCountry, currentIndex }: Props) {
  const [guess, setGuess] = useState<string>("");
  const [flagRevealed, setFlagRevealed] = useState<boolean>(false);

  const spotr = useSpotr({
    collection: countryData,
    fields: [{ name: "country" }],
  });
  const stopWords = ["and", "of", "the"];

  function normalizeName(name: string) {
    return name
      .toLowerCase()
      .split(" ")
      .filter((word) => !stopWords.includes(word));
  }

  function isLongEnoughMatch(guess: string, target: string) {
    const g = guess.trim();
    const t = target.trim();
    const diff = Math.abs(t.length - g.length);

    return diff <= 3;
  }

  function handleGuess() {
    if (!currentCountry || !guess) return;

    const countryWords = normalizeName(currentCountry.country);

    const res = spotr.query(guess);
    const best = res.results.slice(0, 5);

    const match = countryWords.some((countryWord) =>
      best.some(
        (r) =>
          r &&
          r.score >= 0.6 &&
          normalizeName(r.item.country).includes(countryWord) &&
          (isLongEnoughMatch(guess, countryWord) ||
            isLongEnoughMatch(guess, r.item.country)),
      ),
    );

    if (match) {
      setFlagRevealed(true);
      countryData.splice(currentIndex, 1);
    }

    setGuess("");
  }

  function showAnswer() {
    setFlagRevealed(true);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleGuess();
      } else if (event.key === "F2") {
        showAnswer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleGuess]);

  return (
    <FlagSection>
      <ButtonWrapper>
        <button onClick={showAnswer}>Show</button>
      </ButtonWrapper>
      <FlagContainer>
        {currentCountry && (
          <Image src={currentCountry.imagePath} alt={currentCountry.country} />
        )}
      </FlagContainer>
      {!flagRevealed ? (
        <>
          <input
            type="text"
            autoFocus
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button onClick={handleGuess}>Guess</button>
        </>
      ) : (
        <h2>{currentCountry?.country}</h2>
      )}
    </FlagSection>
  );
}
