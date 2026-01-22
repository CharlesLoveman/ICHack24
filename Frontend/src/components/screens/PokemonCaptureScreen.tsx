import React, { useState, useContext, ChangeEvent } from "react";
import axios from "axios";

import NavBar from "../NavBar";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { FaCameraRetro } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import { GiForest, GiSpikyExplosion } from "react-icons/gi";
import { FaDog } from "react-icons/fa";
import { FaBottleWater } from "react-icons/fa6";
import { GlobalData } from "../../App";
import { GlobalContextType } from "../../types";
import { backendAddress } from "../../env";

export default function PokemonCaptureScreen() {
  const data = useContext(GlobalData) as GlobalContextType;
  const [state, setState] = useState<{ selectedFile: File } | null>(null);
  const [url, setURL] = useState<string | undefined>(undefined);
  const [hidden, setHidden] = useState("");

  const params = useParams();

  const navigate = useNavigate();

  // On file select (from the pop up)
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setState({
        selectedFile: event.target.files[0],
      });

      setURL(getImage(event.target.files[0]));
    }

    setHidden("none");
  };

  // On file upload (click the upload button)
  const uploadFile = async function () {
    // Create an object of formData
    data.setPokemonReturned("waiting");
    const formData = new FormData();
    navigate(-1);

    // Update the formData object
    if (state) {
      if (state.selectedFile) {
        formData.append("img", state.selectedFile);
        try {
          const res = await axios.post(
            `${backendAddress}/CreatePokemon/${params.id}`,
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
    }
  };

  const onFileUpload = async function () {
    await uploadFile();
    data.setPokemonReturned("");
    data.setNoNewPokemon(data.noNewPokemon + 1);
  };

  function getImage(image: File) {
    return URL.createObjectURL(image);
  }

  return (
    <>
      <NavBar />
      <div style={{ textAlign: "center" }}>
        <GiForest />
        Capture a new Pokemon!
        <GiForest />
      </div>
      <Button fullWidth={true}>
        <label htmlFor="imageUpload">
          <FaCameraRetro display={hidden} size="9rem"></FaCameraRetro>
        </label>
      </Button>
      <div style={{ textAlign: "center" }}>
        {url && <img src={url} width="200rem" alt="preview" />}
      </div>
      <div style={{ textAlign: "center" }}>
        Take a picture an animal <FaDog />, object <FaBottleWater /> or anything
        else <GiSpikyExplosion /> you would like to Pokefy and upload it here.
        If you're happy with the result, click the tick to adopt the Pokemon.
        Happy capturing!
      </div>

      <Input
        id="imageUpload"
        type="file"
        onChange={onFileChange}
        style={{ display: "none" }}
        inputProps={{ accept: "image/*;capture=camera" }}
      />

      <Button fullWidth={true} onClick={onFileUpload}>
        {" "}
        <IoIosCheckmarkCircle size="2rem" />
      </Button>
    </>
  );
}
