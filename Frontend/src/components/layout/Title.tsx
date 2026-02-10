import styled from "styled-components";
import { HeaderContainer } from "./HeaderContainer";
import { ReactNode } from "react";
import { red } from "../../utils/colors";

const TitleContainer = styled.h1`
  margin: 0;
  font-size: 1.25rem;
`;

interface ColorProps {
  color?: string;
}

const TitleHeaderContainer = styled(HeaderContainer)<ColorProps>`
  background-color: ${(props) => (props.color ? props.color : red)};
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

interface TitleProps extends ColorProps {
  children: ReactNode;
}

export const Title = ({ children, color }: TitleProps) => {
  return (
    <TitleHeaderContainer color={color}>
      <TitleContainer>{children}</TitleContainer>
    </TitleHeaderContainer>
  );
};
