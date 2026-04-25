import styled from "styled-components";
import type { Country, Guessed } from "./App";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { countries as countryData } from "./countries";

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
  currentCountry: Country | null;
  guessed: Guessed;
  setGuessed: Dispatch<SetStateAction<Guessed>>;
}

export function Capitals({ currentCountry, guessed, setGuessed }: Props) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [capitalRevealed, setCapitalRevealed] = useState<boolean>(false);
  const [guess, setGuess] = useState<string>("");

  function checkAnswer(answer: string) {
    setCapitalRevealed(true);
    setGuess(answer);

    if (answer === currentCountry?.capital) {
      setGuessed((prev) => ({
        ...prev,
        capital: true,
      }));
    }
  }

  useEffect(() => {
    if (!currentCountry) return;

    if (!currentCountry.capital) {
      setGuessed((prev) => ({
        ...prev,
        capital: true,
      }));
    }

    const wrongAnswers: string[] = [];

    while (wrongAnswers.length < 3) {
      const random =
        countryData[Math.floor(Math.random() * countryData.length)];

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
      {guessed.flag && !capitalRevealed && currentCountry?.capital !== "" && (
        <ButtonWrapper>
          {answers.map((ans) => (
            <AnswerButton key={ans} onClick={() => checkAnswer(ans)}>
              {ans}
            </AnswerButton>
          ))}
        </ButtonWrapper>
      )}
      {guess &&
        (capitalRevealed && currentCountry?.capital === guess ? (
          <p>
            {currentCountry?.country}'s capital is {currentCountry?.capital}
          </p>
        ) : (
          <p>
            {currentCountry?.country}'s capital is NOT {guess}
          </p>
        ))}
    </>
  );
}
