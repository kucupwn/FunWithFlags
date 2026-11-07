import styled, { keyframes } from "styled-components";
import type { Country, Guessed } from "../Game";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { countries as countryData } from "../data/countries";
import type { GameMode } from "../App";
import { CheckIcon, CrossIcon } from "./icons";

const rise = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

const Section = styled.section`
  width: min(100%, 560px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${rise} 420ms var(--ease-out) both;
`;

const Question = styled.h3`
  font-size: 1.2rem;
  text-align: center;

  em {
    font-style: italic;
  }
`;

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

type AnswerState = "idle" | "correct" | "wrong" | "muted";

const AnswerButton = styled.button<{ $state: AnswerState }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 56px;
  padding: 0.6rem 0.9rem 0.6rem 0.6rem;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.25;
  border-radius: var(--radius);
  border: 1px solid
    ${({ $state }) =>
      $state === "correct"
        ? "var(--correct)"
        : $state === "wrong"
          ? "var(--wrong)"
          : "var(--rule-strong)"};
  background: ${({ $state }) =>
    $state === "correct"
      ? "var(--correct-tint)"
      : $state === "wrong"
        ? "var(--wrong-tint)"
        : "var(--plate)"};
  color: ${({ $state }) =>
    $state === "correct"
      ? "var(--correct)"
      : $state === "wrong"
        ? "var(--wrong)"
        : $state === "muted"
          ? "var(--ink-faint)"
          : "var(--ink)"};
  transition:
    background-color 180ms var(--ease-out),
    border-color 180ms var(--ease-out),
    color 180ms var(--ease-out),
    transform 160ms var(--ease-out);

  &:hover {
    border-color: var(--ink);
    transform: translateY(-1px);
  }

  svg {
    width: 1.2em;
    height: 1.2em;
    margin-left: auto;
    flex: none;
  }
`;

const KeyBadge = styled.span`
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  border: 1px solid currentColor;
  border-radius: 50%;
  opacity: 0.8;
`;

const Result = styled.p<{ $correct: boolean }>`
  min-height: 1.5em;
  text-align: center;
  font-size: 1rem;
  color: ${({ $correct }) => ($correct ? "var(--correct)" : "var(--wrong)")};
`;

interface Props {
  currentCountry: Country | null;
  guessed: Guessed;
  setGuessed: Dispatch<SetStateAction<Guessed>>;
  gameMode: GameMode;
  capitalOptionsHidden: boolean;
}

export function Capitals({
  currentCountry,
  guessed,
  setGuessed,
  gameMode,
  capitalOptionsHidden,
}: Props) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [capitalRevealed, setCapitalRevealed] = useState<boolean>(
    !gameMode.capital ? true : false,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  function checkAnswer(answer: string) {
    setCapitalRevealed(true);
    setSelectedAnswer(answer);

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

  function stateFor(ans: string): AnswerState {
    if (!capitalRevealed) return "idle";
    if (ans === currentCountry?.capital) return "correct";
    if (ans === selectedAnswer) return "wrong";
    return "muted";
  }

  const answeredCorrectly =
    selectedAnswer !== null && selectedAnswer === currentCountry?.capital;

  if (!guessed.flag || !currentCountry?.capital) return null;

  if (capitalOptionsHidden) {
    if (!capitalRevealed) return null;

    return (
      <Section>
        <Result $correct={answeredCorrectly || selectedAnswer === null}>
          {answeredCorrectly || selectedAnswer === null
            ? `${currentCountry.country}'s capital is ${currentCountry.capital}.`
            : `${currentCountry.country}'s capital is ${currentCountry.capital}, not ${selectedAnswer}.`}
        </Result>
      </Section>
    );
  }

  return (
    <Section aria-label="Capital question">
      <Question>
        What is the capital of <em>{currentCountry.country}</em>?
      </Question>
      <ButtonWrapper>
        {answers.map((ans, i) => {
          const state = stateFor(ans);
          return (
            <AnswerButton
              key={ans}
              type="button"
              onClick={() => checkAnswer(ans)}
              $state={state}
            >
              <KeyBadge aria-hidden="true">{i + 1}</KeyBadge>
              {ans}
              {state === "correct" && <CheckIcon />}
              {state === "wrong" && <CrossIcon />}
            </AnswerButton>
          );
        })}
      </ButtonWrapper>
      {/* Always rendered so the line's space is reserved and nothing below shifts */}
      <Result $correct={answeredCorrectly} role="status">
        {selectedAnswer === null
          ? ""
          : answeredCorrectly
            ? "Correct. Press → for the next flag."
            : "Not this time. This country will come back later."}
      </Result>
    </Section>
  );
}
