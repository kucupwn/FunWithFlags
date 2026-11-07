import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import styled, { css, keyframes } from "styled-components";
import { useSpotr } from "spotr/react";
import type { Country, Guessed } from "../Game";
import type { GameMode } from "../App";
import { countries as countryData } from "../data/countries";
import { GhostButton, Kbd, PrimaryButton } from "./ui";
import { CheckIcon, EyeIcon } from "./icons";

const develop = keyframes`
  from {
    opacity: 0.35;
    filter: blur(6px) sepia(0.6);
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    filter: blur(0) sepia(0);
    transform: none;
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(7px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(3px); }
`;

const FlagSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
`;

/* The flag sits on a mounted plate, like a specimen in an atlas */
const Plate = styled.figure`
  margin: 0;
  width: min(100%, 480px, max(280px, 56vh));
  padding: 14px;
  background: var(--plate);
  border: 1px solid var(--rule-strong);
  border-radius: 3px;
  box-shadow: var(--shadow-plate);
  animation: ${develop} 700ms var(--ease-out) both;
`;

const FlagFrame = styled.div`
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  background:
    linear-gradient(var(--plate), var(--plate)) padding-box,
    repeating-linear-gradient(
        45deg,
        var(--paper-deep) 0 6px,
        var(--plate) 6px 12px
      )
      border-box;
  border: 1px solid var(--rule);
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 0 0 1px rgba(35, 32, 27, 0.12);
`;

const Answer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
`;

const CountryName = styled.h2`
  font-size: clamp(2rem, 6vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-variation-settings: "opsz" 144;
`;

const Status = styled.p<{ $tone: "correct" | "revealed" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.925rem;
  font-weight: 500;
  color: ${({ $tone }) =>
    $tone === "correct" ? "var(--correct)" : "var(--ink-soft)"};

  svg {
    width: 1.1em;
    height: 1.1em;
  }
`;

const GuessArea = styled.div`
  width: min(100%, 480px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const GuessRow = styled.div<{ $shake: boolean }>`
  width: 100%;
  display: flex;
  gap: 0.75rem;
  ${({ $shake }) =>
    $shake &&
    css`
      animation: ${shake} 380ms var(--ease-out);
    `}
`;

const GuessInput = styled.input<{ $wrong: boolean }>`
  flex: 1;
  min-width: 0;
  height: 52px;
  padding: 0 1rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  background: var(--plate);
  border: 1px solid
    ${({ $wrong }) => ($wrong ? "var(--wrong)" : "var(--rule-strong)")};
  border-radius: var(--radius);
  transition:
    border-color 200ms var(--ease-out),
    box-shadow 200ms var(--ease-out);

  &::placeholder {
    color: var(--ink-faint);
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-color: ${({ $wrong }) => ($wrong ? "var(--wrong)" : "var(--sea)")};
    box-shadow: 0 0 0 3px
      ${({ $wrong }) => ($wrong ? "var(--wrong-tint)" : "var(--sea-tint)")};
  }
`;

const GuessRowButton = styled(PrimaryButton)`
  height: 52px;
`;

const Feedback = styled.p`
  min-height: 1.5em;
  font-size: 0.925rem;
  color: var(--wrong);
`;

const CapitalLine = styled.p`
  margin-top: 0.6rem;
  font-size: 1.1rem;
  color: var(--ink-soft);

  strong {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--ink);
  }
`;

const EndTitle = styled.h2`
  font-size: clamp(2rem, 6vw, 2.75rem);
  letter-spacing: -0.02em;
`;

const EndText = styled.p`
  color: var(--ink-soft);
`;

interface Props {
  countries: Country[];
  currentCountry: Country | null;
  guessed: Guessed;
  setGuessed: Dispatch<SetStateAction<Guessed>>;
  gameMode: GameMode;
}

export function Flags({
  countries,
  currentCountry,
  guessed,
  setGuessed,
  gameMode,
}: Props) {
  const [guess, setGuess] = useState<string>("");
  const [flagRevealed, setFlagRevealed] = useState<boolean>(
    !gameMode.flag ? true : false,
  );
  const [lastMiss, setLastMiss] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  const spotr = useSpotr({
    collection: countries,
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
      setLastMiss(null);
      setGuessed((prev) => ({
        ...prev,
        flag: true,
      }));
    } else {
      setLastMiss(guess.trim());
      setShaking(true);
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

  if (!currentCountry) {
    return (
      <FlagSection>
        <Plate>
          <FlagFrame>
            <Image src="/Congrat.PNG" alt="A cat in a party hat" />
          </FlagFrame>
        </Plate>
        <Answer>
          <EndTitle>Every flag identified</EndTitle>
          <EndText>
            You named all {countryData.length} countries and territories.
          </EndText>
        </Answer>
      </FlagSection>
    );
  }

  return (
    <FlagSection>
      <Plate>
        <FlagFrame>
          <Image
            src={currentCountry.imagePath}
            alt={flagRevealed ? `Flag of ${currentCountry.country}` : "Mystery flag"}
          />
        </FlagFrame>
      </Plate>

      {!flagRevealed ? (
        <GuessArea>
          <GuessRow $shake={shaking} onAnimationEnd={() => setShaking(false)}>
            <GuessInput
              type="text"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              aria-label="Country name"
              placeholder="Which country is this?"
              value={guess}
              $wrong={lastMiss !== null && guess === ""}
              onChange={(e) => setGuess(e.target.value)}
            />
            <GuessRowButton type="button" onClick={handleGuess}>
              Guess
            </GuessRowButton>
          </GuessRow>
          <Feedback role="status">
            {lastMiss ? `Not ${lastMiss}. Try again.` : ""}
          </Feedback>
          <GhostButton type="button" onClick={showAnswer}>
            <EyeIcon />
            Reveal answer
            <Kbd>F2</Kbd>
          </GhostButton>
        </GuessArea>
      ) : (
        <Answer>
          <CountryName>{currentCountry.country}</CountryName>
          {gameMode.flag &&
            (guessed.flag ? (
              <Status $tone="correct">
                <CheckIcon />
                Correct
              </Status>
            ) : (
              <Status $tone="revealed">
                Revealed. This flag will come back later.
              </Status>
            ))}
          {gameMode.flag && !gameMode.capital && guessed.flag && (
            <CapitalLine>
              Capital: <strong>{currentCountry.capital || "N/A"}</strong>
            </CapitalLine>
          )}
        </Answer>
      )}
    </FlagSection>
  );
}
