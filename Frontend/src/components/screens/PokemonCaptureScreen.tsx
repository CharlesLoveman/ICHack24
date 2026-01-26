import { ChangeEvent } from "react";
import axios from "axios";

import Input from "@mui/material/Input";
import { FaCameraRetro } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import { GiForest, GiSpikyExplosion } from "react-icons/gi";
import { FaDog } from "react-icons/fa";
import { FaBottleWater } from "react-icons/fa6";
import { POKEMON_HAS_RETURNED } from "../../types";
import { backendAddress } from "../../env";
import { useGlobalData } from "../../hooks/useGlobalData";
import { Title } from "../layout/Title";
import { Box, Typography } from "@mui/material";
import styled from "styled-components";
import { darkGrey, red } from "../../utils/colors";

// On file upload (click the upload button)
const uploadFile = async function (selectedFile?: File, id?: string) {
  // Create an object of formData

  const formData = new FormData();

  // Update the formData object
  if (selectedFile) {
    formData.append("img", selectedFile);
    try {
      const res = await axios.post(
        `${backendAddress}/CreatePokemon/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.message;
    } catch (err) {
      console.log(err);
    }
  }
};

const CaptureContainer = styled.div`
  margin: auto;
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
  const { setPokemonReturned, setNoNewPokemon, noNewPokemon } = useGlobalData();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const onFileUpload = async function (file?: File) {
    setPokemonReturned(POKEMON_HAS_RETURNED.WAITING);
    navigate(-1);
    await uploadFile(file, params.id);
    setPokemonReturned(POKEMON_HAS_RETURNED.RETURNED);
    setNoNewPokemon(noNewPokemon + 1);
  };

  // On file select (from the pop up)
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileUpload(event.target.files[0]);
    }
  };

  return (
    <>
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
    </>
  );
}
