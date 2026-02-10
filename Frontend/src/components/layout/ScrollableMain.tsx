import React, { ReactNode } from "react";
import styled from "styled-components";

interface ScrollableMainProps {
  children: ReactNode;
}

const MainContainer = styled.main`
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
`;

export const ScrollableMain: React.FC<ScrollableMainProps> = ({ children }) => {
  return <MainContainer>{children}</MainContainer>;
};
