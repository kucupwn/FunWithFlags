import styled from "styled-components";
import type { Country } from "../Game";
import { countries as countryData } from "../data/countries";

const CounterText = styled.h3`
  font-size: 20px;
`;

interface Props {
  countries: Country[];
}

export function Counter({ countries }: Props) {
  return (
    <CounterText>{`${countryData.length - countries.length}/${countryData.length}`}</CounterText>
  );
}
