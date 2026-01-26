import { OutlinedInput, OutlinedInputProps } from "@mui/material";
import styled from "styled-components";

const LongInputContainer = styled.div`
  max-width: 100rem;
  margin: auto;
`;

const inputStyle = { style: { textAlign: "center" as const } };

export function LongInput(props: OutlinedInputProps) {
  return (
    <LongInputContainer>
      <OutlinedInput fullWidth={true} inputProps={inputStyle} {...props} />
    </LongInputContainer>
  );
}
