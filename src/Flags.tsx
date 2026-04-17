import { useEffect, useState } from "react";
import styled from "styled-components";

const FlagSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-self: center;
`;

const FlagContainer = styled.div`
  max-width: 500px;
  max-height: 400px;
`;

export function Flags() {
  const [currentFlag, setcurrentFlag] = useState<string>("");
  const [guessedFlags, setGuessedFlags] = useState<string[]>([]);

  useEffect(() => {}, []);

  return (
    <FlagSection>
      <input type="text" />
      <button>Guess</button>
      <FlagContainer>
        <img src={currentFlag} alt={currentFlag} />
      </FlagContainer>
    </FlagSection>
  );
}
