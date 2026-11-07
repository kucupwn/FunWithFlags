import styled from "styled-components";
import type { Country } from "../Game";
import { countries as countryData } from "../data/countries";

const Wrapper = styled.div`
  flex: 1;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.p`
  font-size: 0.875rem;
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;

  strong {
    color: var(--ink);
    font-weight: 600;
  }
`;

/* Progress drawn like a map scale bar: ten ruled segments */
const Scale = styled.div`
  position: relative;
  height: 8px;
  border: 1px solid var(--ink);
  background: repeating-linear-gradient(
    90deg,
    var(--plate) 0 calc(10% - 1px),
    var(--ink) calc(10% - 1px) 10%
  );
  overflow: hidden;
`;

const Fill = styled.div`
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--sea);
  transition: width 500ms var(--ease-out);
`;

interface Props {
  countries: Country[];
}

export function Counter({ countries }: Props) {
  const total = countryData.length;
  const done = total - countries.length;
  const pct = (done / total) * 100;

  return (
    <Wrapper>
      <Label>
        <strong>{done}</strong> of {total} identified
      </Label>
      <Scale
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label="Countries identified"
      >
        <Fill style={{ width: `${pct}%` }} />
      </Scale>
    </Wrapper>
  );
}
