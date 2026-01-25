import styled from "styled-components";
import { HeaderContainer } from "./HeaderContainer";

const TitleContainer = styled.h1`
  margin: 0;
  font-size: 1.25rem;
`;

const TitleHeaderContainer = styled(HeaderContainer)`
  background-color: #ff5252;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

interface TitleProps {
  title: string;
}

export const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <TitleHeaderContainer>
      <TitleContainer>{title}</TitleContainer>
    </TitleHeaderContainer>
  );
};
