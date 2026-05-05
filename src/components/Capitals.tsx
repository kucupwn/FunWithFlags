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

const AnswerButton = styled.button<{
  $revealed: boolean;
  $selected: boolean;
  $correct: boolean;
}>`
  width: 180px;
  height: 50px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ $revealed, $selected, $correct }) => {
    if (!$revealed) return "rgb(255, 218, 173)";
    if ($selected) return $correct ? "rgb(139, 189, 22)" : "rgb(237, 40, 40)";
    if ($correct) return "rgb(139, 189, 22)";
    return "rgb(255, 218, 173)";
  }};
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
  // const [guess, setGuess] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  function checkAnswer(answer: string) {
    setCapitalRevealed(true);
    setSelectedAnswer(answer);
    // setGuess(answer);

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
      {/* Add ' && !capitalRevealed ', if there are more country properties! */}
      {guessed.flag && currentCountry?.capital !== "" && (
        <ButtonWrapper>
          {answers.map((ans, i) => (
            <AnswerButton
              key={ans}
              onClick={() => checkAnswer(ans)}
              $revealed={capitalRevealed}
              $selected={ans === selectedAnswer}
              $correct={ans === currentCountry?.capital}
            >
              {`${i + 1}. ${ans}`}
            </AnswerButton>
          ))}
        </ButtonWrapper>
      )}

      {/* This, and state 'guess' will only need, when there will be more country properties! */}
      {/* {capitalRevealed &&
        currentCountry?.capital &&
        ((guess && currentCountry?.capital === guess) || guess === "" ? (
          <p>
            {currentCountry?.country}'s capital is {currentCountry?.capital}
          </p>
        ) : (
          <p>
            {currentCountry?.country}'s capital is NOT {guess}
          </p>
        ))} */}
    </>
  );
}
