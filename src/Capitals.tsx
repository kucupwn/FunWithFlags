import styled from "styled-components";
import type { Country, Guessed } from "./App";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const AnswerButton = styled.button`
  width: 150px;
  height: 50px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
`;

interface Props {
  countries: Country[];
  currentCountry: Country | null;
  guessed: Guessed;
  setGuessed: Dispatch<SetStateAction<Guessed>>;
}

export function Capitals({
  countries,
  currentCountry,
  guessed,
  setGuessed,
}: Props) {
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (!currentCountry) return;

    const wrongAnswers: string[] = [];

    while (wrongAnswers.length < 3) {
      const random = countries[Math.floor(Math.random() * countries.length)];

      if (
        random.capital !== "" &&
        random.capital !== currentCountry.capital &&
        !wrongAnswers.includes(random.capital)
      ) {
        wrongAnswers.push(random.capital);
      }
    }

    const shuffled = [currentCountry.capital, ...wrongAnswers].sort(
      () => Math.random() - 0.5,
    );

    setAnswers(shuffled);
  }, [currentCountry]);

  return (
    <>
      {guessed.flag && currentCountry?.capital !== "" ? (
        <ButtonWrapper>
          {answers.map((ans) => (
            <AnswerButton key={ans}>{ans}</AnswerButton>
          ))}
        </ButtonWrapper>
      ) : (
        <p>{currentCountry?.country} missing capital data.</p>
      )}
    </>
  );
}
