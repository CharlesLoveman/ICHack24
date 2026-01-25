import { Button, ButtonProps, Typography } from "@mui/material";
import styled from "styled-components";

interface MaxWidthProps {
  noMaxWidth?: boolean;
}

const LongButtonContainer = styled.div<MaxWidthProps>`
  ${(props) =>
    !props.noMaxWidth
      ? `
    max-width: 100rem;
    margin: auto;
        `
      : ""}
`;

const LongButtonTextContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

export function LongButton(props: ButtonProps & MaxWidthProps) {
  return (
    <LongButtonContainer noMaxWidth={props.noMaxWidth}>
      <Button fullWidth={true} color="primary" {...props}>
        <LongButtonTextContainer>
          <Typography variant="h5">{props.children}</Typography>
        </LongButtonTextContainer>
      </Button>
    </LongButtonContainer>
  );
}
