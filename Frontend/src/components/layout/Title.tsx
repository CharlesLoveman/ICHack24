import styled from "styled-components";
import { HeaderContainer } from "./HeaderContainer";
import { ReactNode } from "react";
import { red } from "../../utils/colors";

const TitleContainer = styled.h1`
  margin: 0;
  font-size: 1.25rem;
`;

const TitleHeaderContainer = styled(HeaderContainer)`
  background-color: ${red};
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

interface TitleProps {
  children: ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <TitleHeaderContainer>
      <TitleContainer>{children}</TitleContainer>
    </TitleHeaderContainer>
  );
};
