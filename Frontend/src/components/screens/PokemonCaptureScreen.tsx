import { ChangeEvent } from "react";

import Input from "@mui/material/Input";
import { FaCameraRetro } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import { GiForest, GiSpikyExplosion } from "react-icons/gi";
import { FaDog } from "react-icons/fa";
import { FaBottleWater } from "react-icons/fa6";
import { Title } from "../layout/Title";
import { Box, Typography } from "@mui/material";
import styled from "styled-components";
import { darkGrey, red } from "../../utils/colors";
import { socket } from "../../socket";
import { ScrollableMain } from "../layout/ScrollableMain";

const uploadFile = async function (selectedFile?: File, username?: string) {
  if (!username || !selectedFile) return;
  const reader = new FileReader();
  reader.onload = function () {
    if (this.result) {
      const networkBytes = new Uint8Array(this.result as ArrayBuffer);
      socket.emit("createPokemon", {
        image_bytes: networkBytes,
        username: username,
      });
    }
  };
  reader.readAsArrayBuffer(selectedFile);
};

const CaptureContainer = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  display: grid;
  place-items: center;
  grid-template-areas: "inner-div";
`;

const Absolute = styled.div`
  grid-area: inner-div;
  position: relative;
`;

const Circle = styled.div`
  background-color: white;
  border-radius: 100rem;
  padding: 0.9rem;
  height: 2rem;
  width: 2rem;
  z-index: 100;
  position: relative;
  bottom: -0.9rem;
`;

export default function PokemonCaptureScreen() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const onFileUpload = async function (file?: File) {
    navigate(-1);
    uploadFile(file, params.id);
  };

  // On file select (from the pop up)
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileUpload(event.target.files[0]);
    }
  };

  return (
    <ScrollableMain>
      <Title>
        Capture a new Pokemon!
        <GiForest />
      </Title>
      <Typography style={{ textAlign: "center" }} variant="h6">
        Take a picture of an animal <FaDog />, object <FaBottleWater /> or
        anything else <GiSpikyExplosion /> you would like to Pokefy!
      </Typography>
      <CaptureContainer>
        <Absolute>
          <Circle></Circle>
        </Absolute>
        <Absolute>
          <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
            <Box
              style={{
                color: darkGrey,
                borderRadius: "100rem",
                backgroundColor: red,
                padding: "5rem",
                zIndex: "0",
              }}
            >
              <FaCameraRetro size="10rem"></FaCameraRetro>
            </Box>
          </label>
        </Absolute>
      </CaptureContainer>

      <Input
        id="imageUpload"
        type="file"
        onChange={onFileChange}
        style={{ display: "none" }}
        inputProps={{ accept: "image/*;capture=camera" }}
      />
    </ScrollableMain>
  );
}
