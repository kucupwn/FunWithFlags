import styled from "styled-components";
import type { Country, Guessed } from "./App";
import type { Dispatch, SetStateAction } from "react";

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

interface Props {
  countries: Country[];
  currentCountry: Country | null;
  setGuessed: Dispatch<SetStateAction<Guessed>>;
}

export function Capitals({ countries }: Props) {
  return (
    <ButtonWrapper>
      <button>answer</button>
      <button>answer</button>
      <button>answer</button>
      <button>answer</button>
    </ButtonWrapper>
  );
}
