import React, { useState } from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { GiBattleAxe } from "react-icons/gi";

const orig_username = String(Math.floor(Math.random() * 1000000));

export default function LoginInputBox(
  updateAndInitialiseUser: (username: string) => void,
  sx: any
) {
  const [username, setUsername] = useState<string>(orig_username);

  function updateUsername() {
    updateAndInitialiseUser(username);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode == 13) {
      updateUsername();
    }
  }

  return (
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
        defaultValue={orig_username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </>
  );
}
