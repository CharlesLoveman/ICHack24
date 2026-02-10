import styled from "styled-components";
import { darkGrey } from "../../utils/colors";

export const Bar = styled.div`
  background-color: ${darkGrey};
  height: 0.5rem;
  padding: 0.3rem;
  width: 15rem;
  z-index: 100;
  position: relative;
`;

export interface HealthProps {
  $hp: number;
  $maxHp: number;
}

export const Health = styled.div<HealthProps>`
  background-color: #59b859;
  height: 0.5rem;
  width: ${(props) => (props.$hp / props.$maxHp) * 15}rem;
  z-index: 100;
  position: relative;
`;

export interface FilledBarProps {
  hp: number;
  maxHp: number;
}

export function FilledBar({ hp, maxHp }: FilledBarProps) {
  return (
    <Bar>
      <Health $maxHp={maxHp} $hp={hp}></Health>
    </Bar>
  );
}
