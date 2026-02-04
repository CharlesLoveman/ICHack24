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
import { ScrollableMain } from "../layout/ScrollableMain";
import FilePicker from "@ihatecode/react-file-picker";
import { backendAddress } from "../../env";
import axios from "axios";

const uploadFile = async function (selectedFile?: File, username?: string) {
  const formData = new FormData();

  // Update the formData object
  if (selectedFile) {
    formData.append("img", selectedFile);
    try {
      const res = await axios.post(
        `${backendAddress}/create-pokemon/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data.message;
    } catch (err) {
      console.log(err);
    }
  }
};

const CaptureContainer = styled.div`
  margin-top: 10vh;
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
    event.preventDefault();
    console.log("onFileChange has been triggered");
    _onFileChange(event.target.files);
  };

  const _onFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      console.log("Uploading your file");
      onFileUpload(files[0]);
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
          <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
            <Circle></Circle>
          </label>
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

      <FilePicker accept="image/*" onChange={_onFileChange}>
        <Typography
          style={{ textAlign: "center", margin: "2rem", color: "grey" }}
          variant="h6"
        >
          Click if you wish to select files directly
        </Typography>
      </FilePicker>
    </ScrollableMain>
  );
}
