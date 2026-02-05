import { ChangeEvent, useEffect, useState } from "react";

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
import { backendAddress, CAPTURE_SCREEN_JUST_REFRESHED } from "../../env";
import axios, { AxiosProgressEvent } from "axios";
import { Bar, Health } from "../pokedex/PokemonDisplay";
import { useGlobalData } from "../../hooks/useGlobalData";
import axiosRetry, { linearDelay } from "axios-retry";

axiosRetry(axios, { retries: 3, retryDelay: linearDelay() });

const uploadFile = async function (
  selectedFile?: File,
  username?: string,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void = () => {},
  onError: (error: string) => void = () => {},
) {
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
          onUploadProgress,
        },
      );
      return res.data.message;
    } catch (err) {
      console.log(err);
      onError(err as string);
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

const Container = styled.div`
  text-align: center;
`;

const HideableContainer = styled.div<{ $hidden: boolean }>`
  ${(props) => (props.$hidden ? "display: none" : "")}
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  gap: 2rem;
  padding: 2rem;
  margin-top: 20dvh;
`;

export default function PokemonCaptureScreen() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const { addNotification } = useGlobalData();

  const beforePageReload = () => {
    localStorage.setItem(CAPTURE_SCREEN_JUST_REFRESHED, "true");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", beforePageReload);

    return () => {
      window.removeEventListener("beforeunload", beforePageReload);
    };
  }, []);

  const onError = (message: string) => {
    addNotification({
      message: "Send Error:" + message,
      severity: "error",
    });
    setIsUploading(false);
  };

  const onFileUpload = async function (file?: File) {
    setIsUploading(true);
    uploadFile(file, params.id, onUploadProgress, onError);
  };

  // On file select (from the pop up)
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // event.preventDefault();
    // event.persist();
    // event.stopPropagation();
    console.log("onFileChange has been triggered");
    _onFileChange(event.target.files);
  };

  const _onFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      console.log("Uploading your file");
      onFileUpload(files[0]);
    }
  };

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    setProgress(progressEvent.progress);
  };

  useEffect(() => {
    if (progress === 1) {
      addNotification({
        message: "Pokemon has been sent to the mainframe",
        severity: "info",
      });
      setTimeout(() => {
        setIsUploading(false);
      }, 1000);
    }
  }, [progress]);

  useEffect(() => {
    if (!isUploading && progress === 1) navigate("/");
  }, [isUploading]);

  return (
    <ScrollableMain>
      <Title>
        Capture a new Pokemon!
        <GiForest />
      </Title>
      <Container>
        <HideableContainer $hidden={isUploading}>
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

          <FilePicker accept="image/*" onChange={_onFileChange}>
            <Typography
              style={{ textAlign: "center", margin: "2rem", color: "grey" }}
              variant="h6"
            >
              Click if you wish to select files directly
            </Typography>
          </FilePicker>
        </HideableContainer>
        <HideableContainer $hidden={!isUploading}>
          <UploadContainer>
            <Typography variant="h4"> Uploading your Pokemon </Typography>
            <Bar>
              <Health $maxHp={1} $hp={progress ?? 0}></Health>
            </Bar>
          </UploadContainer>
        </HideableContainer>

        <Input
          id="imageUpload"
          type="file"
          onChange={onFileChange}
          style={{ display: "none" }}
          inputProps={{ accept: "image/*;capture=camera", capture: true }}
        />
      </Container>
    </ScrollableMain>
  );
}
