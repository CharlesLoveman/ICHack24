import React from "react";
import styled from "styled-components";
import { FooterContainer } from "../layout/FooterContainer";
import { darkGrey } from "../../utils/colors";

const Copyright = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

const CopyrightFooterContainer = styled(FooterContainer)`
  padding: 1rem;
  background-color: ${darkGrey};
  height: 1rem;
`;

export const CopyrightFooter: React.FC = () => {
  return (
    <CopyrightFooterContainer>
      <Copyright>&copy; 2024 ICHack24 Pokedex</Copyright>
    </CopyrightFooterContainer>
  );
};
