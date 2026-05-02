import styled from "styled-components";
import type { Country, Guessed } from "../Game";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { countries as countryData } from "../data/countries";
import type { GameMode } from "../App";

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const AnswerButton = styled.button`
  width: 200px;
  height: 50px;
  font-size: 18px;
  border-radius: 10px;
  background-color: rgb(255, 218, 173);
  cursor: pointer;
`;

interface Props {
  currentCountry: Country | null;
  guessed: Guessed;
  setGuessed: Dispatch<SetStateAction<Guessed>>;
  gameMode: GameMode;
}

export function Capitals({
  currentCountry,
  guessed,
  setGuessed,
  gameMode,
}: Props) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [capitalRevealed, setCapitalRevealed] = useState<boolean>(
    !gameMode.capital ? true : false,
  );
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        checkAnswer(answers[0]);
      } else if (event.key === "2") {
        checkAnswer(answers[1]);
      } else if (event.key === "3") {
        checkAnswer(answers[2]);
      } else if (event.key === "4") {
        checkAnswer(answers[3]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [checkAnswer]);

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
      {capitalRevealed &&
        (guess && currentCountry?.capital === guess ? (
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
