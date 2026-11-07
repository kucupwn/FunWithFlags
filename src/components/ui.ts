import styled, { css } from "styled-components";
export const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  height: 1.6em;
  padding: 0 0.4em;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--ink-soft);
  background: var(--plate);
  border: 1px solid var(--rule-strong);
  border-bottom-width: 2px;
  border-radius: 4px;
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  height: 44px;
  padding: 0 1.1rem;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  border-radius: var(--radius);
  transition:
    background-color 160ms var(--ease-out),
    border-color 160ms var(--ease-out),
    color 160ms var(--ease-out),
    transform 160ms var(--ease-out);

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  svg {
    width: 1.1em;
    height: 1.1em;
    flex: none;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  color: var(--plate);
  background: var(--ink);
  border: 1px solid var(--ink);

  &:hover:not(:disabled) {
    background: var(--sea);
    border-color: var(--sea);
  }

  &:disabled {
    color: var(--ink-faint);
    background: var(--paper-deep);
    border-color: var(--rule);
  }

  ${Kbd} {
    color: var(--plate);
    background: transparent;
    border-color: rgba(251, 247, 238, 0.45);
  }

  &:disabled ${Kbd} {
    color: var(--ink-faint);
    border-color: var(--rule);
  }
`;

export const GhostButton = styled.button`
  ${buttonBase}
  color: var(--ink-soft);
  background: transparent;
  border: 1px solid var(--rule-strong);

  &:hover:not(:disabled) {
    color: var(--ink);
    background: var(--plate);
    border-color: var(--ink-soft);
  }
`;

