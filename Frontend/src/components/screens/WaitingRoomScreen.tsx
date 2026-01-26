import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { Title } from "../layout/Title";
import styled from "styled-components";
import { LongInput } from "../layout/LongInput";

export default function WaitingRoomScreen() {
  const params = useParams();

  const WaitingRoomContainer = styled.div`
    text-align: center;
    margin: auto;
  `;

  return (
    <>
      <Title>Waiting Room</Title>
      <WaitingRoomContainer>
        <Typography variant="h2" style={{ fontSize: "10vw" }}>
          Room Code
        </Typography>
        <br />
        <br />
        <>
          <LongInput
            value={params.game_id}
            disabled={true}
            style={{ fontSize: "300rem", maxWidth: "80%" }}
            inputProps={{ style: { fontSize: "10vw", textAlign: "center" } }}
          ></LongInput>
        </>
      </WaitingRoomContainer>
    </>
  );
}
