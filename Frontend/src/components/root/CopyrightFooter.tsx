import styled from "styled-components";
import { FooterContainer } from "../layout/FooterContainer";
import { darkGrey } from "../../utils/colors";
import { HiddenClicks } from "../BrowserRouter";

const Copyright = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

const CopyrightFooterContainer = styled(FooterContainer)`
  padding: 1rem;
  background-color: ${darkGrey};
  height: 1rem;
`;

export const CopyrightFooter = ({ noClicks, setNoClicks }: HiddenClicks) => {
  return (
    <CopyrightFooterContainer>
      <Copyright onClick={() => setNoClicks(noClicks + 1)}>
        &copy; 2026 AR Pokemon
      </Copyright>
    </CopyrightFooterContainer>
  );
};
