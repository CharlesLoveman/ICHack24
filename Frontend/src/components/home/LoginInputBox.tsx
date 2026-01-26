import React, { useState } from "react";
import axios from "axios";
import { backendAddress } from "../../env";
import { useGlobalData } from "../../hooks/useGlobalData";
import { generate } from "random-words";
import { LongButton } from "../layout/LongButton";
import styled from "styled-components";
import { LongInput } from "../layout/LongInput";

const generateRandomUserName = () => generate({ exactly: 3, join: "-" });

const LoginInputContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

export default function LoginInputBox() {
  const [formUsername, setFormUsername] = useState<string>(
    generateRandomUserName()
  );
  const { username, setUsername, setPokemon } = useGlobalData();

  interface LoginResponse {
    pid: string;
  }

  function initialiseUser(username: string) {
    axios
      .post(`${backendAddress}/InitialiseUser/${username}`)
      .then((response) => {
        // Plausible TODO: use the pid in the frontend and backend as a unique id
        // For now, we assume usernames are unique, plus let you log in as the same user again
        console.log((response as unknown as LoginResponse).pid);
        setUsername(username);
        localStorage.setItem("username", username);
      });
  }

  function updateAndInitialiseUser(newUsername: string) {
    setFormUsername(newUsername);
    setPokemon(null);
    initialiseUser(newUsername);
  }

  function updateUsername() {
    updateAndInitialiseUser(formUsername);
  }

  function logout() {
    setUsername(undefined);
    setPokemon(null);
    setFormUsername(generateRandomUserName());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      updateUsername();
    }
  }

  return (
    <LoginInputContainer>
      {username ? (
        <LongButton onClick={() => logout()}>Logout</LongButton>
      ) : (
        <>
          <LongInput
            fullWidth={true}
            onKeyDown={(e) => handleKeyDown(e)}
            defaultValue={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
          />
          <LongButton onClick={() => updateUsername()}>Log in</LongButton>
        </>
      )}
    </LoginInputContainer>
  );
}
