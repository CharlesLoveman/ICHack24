import React, { useState } from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { GiBattleAxe } from "react-icons/gi";
import { SxProps, Theme } from "@mui/material";
import axios from "axios";
import { backendAddress } from "../env";
import { useGlobalData } from "../hooks/useGlobalData";
import { generate } from "random-words";

const generateRandomUserName = () => generate({ exactly: 3, join: "-" });

export default function LoginInputBox({ sx }: { sx: SxProps<Theme> }) {
  const [formUsername, setFormUsername] = useState<string>(
    generateRandomUserName()
  );
  const { username, setUsername, setPokemon } = useGlobalData();

  const storedUsername = localStorage.getItem("username");

  if (storedUsername != null) {
    initialiseUser(storedUsername);
  }

  function initialiseUser(username: string) {
    axios
      .post(`${backendAddress}/InitialiseUser/${username}`)
      .then((response) => {
        console.log(response.data.message);
        setUsername(username);
        localStorage.setItem("username", username);
      });
  }

  function updateAndInitialiseUser(new_username: string) {
    setFormUsername(new_username);
    setPokemon(null);
    initialiseUser(new_username);
  }

  function updateUsername() {
    updateAndInitialiseUser(formUsername);
  }

  function logout() {
    setUsername(undefined);
    setFormUsername(generateRandomUserName());
    localStorage.removeItem("username");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode == 13) {
      updateUsername();
    }
  }

  return username ? (
    <Button
      sx={sx}
      fullWidth={true}
      color="error"
      startIcon={<GiBattleAxe size="1rem" />}
      endIcon={<GiBattleAxe size="1rem" />}
      variant="contained"
      size="large"
      type="submit"
      onClick={() => logout()}
    >
      Logout
    </Button>
  ) : (
    <>
      <Button
        sx={sx}
        fullWidth={true}
        color="error"
        startIcon={<GiBattleAxe size="1rem" />}
        endIcon={<GiBattleAxe size="1rem" />}
        variant="contained"
        size="large"
        type="submit"
        onClick={() => updateUsername()}
      >
        Login
      </Button>
      <br />
      <Input
        onKeyDown={(e) => handleKeyDown(e)}
        defaultValue={formUsername}
        onChange={(e) => setFormUsername(e.target.value)}
      />
    </>
  );
}
