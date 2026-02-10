import styled from "styled-components";
import { Button } from "@mui/material";
import { ImCross } from "react-icons/im";
import { RightAlignedContainer } from "../layout/RightAlignedContainer";

const CrossContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
`;

export const CrossButton = ({ onClose }: { onClose: () => void }) => (
  <CrossContainer>
    <RightAlignedContainer>
      <Button
        style={{
          color: "black",
          marginTop: "1rem",
          marginRight: "1rem",
        }}
        variant="text"
        onClick={onClose}
      >
        <ImCross size="2rem" />
      </Button>
    </RightAlignedContainer>
  </CrossContainer>
);
