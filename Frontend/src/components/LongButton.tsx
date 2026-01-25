import { Button, ButtonProps, Typography } from "@mui/material";
import styled from "styled-components";

const LongButtonContainer = styled.div`
  max-width: 100rem;
  margin: auto;
`;

const LongButtonTextContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

export function LongButton(props: ButtonProps) {
  return (
    <LongButtonContainer>
      <Button fullWidth={true} color="primary" {...props}>
        <LongButtonTextContainer>
          <Typography variant="h5">{props.children}</Typography>
        </LongButtonTextContainer>
      </Button>
    </LongButtonContainer>
  );
}
