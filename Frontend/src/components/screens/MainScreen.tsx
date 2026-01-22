import { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import JoinRoomInputBox from "../JoinRoomInputBox";
import { Link } from "react-router-dom";
import axios from "axios";
import { GiBattleGear } from "react-icons/gi";
import { MdCatchingPokemon } from "react-icons/md";
import "./styles.css";

import { socket } from "../../socket";

import { useLayoutEffect } from "react";
import LoginInputBox from "../LoginInputBox";
import { GlobalData } from "../../App";
import { TbPokeball } from "react-icons/tb";
import { GiPokecog } from "react-icons/gi";
import "./MainScreen.css";
import { CreateBattleData, Pokemon } from "../../sharedTypes";
import { backendAddress } from "../../env";
import { POKEMON_HAS_RETURNED, GlobalContextType } from "../../types";

export default function MainScreen() {
  const {
    username,
    setUsername,
    pokemon,
    setPokemon,
    pokemonReturned,
    noNewPokemon,
  } = useContext(GlobalData) as GlobalContextType;

  const [display, setDisplay] = useState("notReady");

  function initialiseUser(username: string) {
    axios.post(`${backendAddress}/InitialiseUser/${username}`);
  }

  function updateAndInitialiseUser(new_username: string) {
    setUsername(new_username);
    setPokemon(null);
    initialiseUser(new_username);
  }

  useEffect(() => {
    if (pokemon) {
      setDisplay("ready");
    } else {
      setDisplay("notReady");
    }
  }, [pokemon]);

  // fetchPokemon()

  function createBattle(pokemon: Pokemon | null) {
    if (pokemon) {
      socket.emit("createBattle", {
        username: username,
        pokemon_id: pokemon.id,
      } as CreateBattleData);
    }
  }

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height] = useWindowSize();
  //var sx = { "font-size": width / 15 };
  const sx = { "font-size": height / 30 };

  function displayReady() {
    return (
      <div>
        <TbPokeball /> {pokemon?.name} is ready to go!{" "}
      </div>
    );
  }

  function displayNotReady() {
    return <div>No Pokemon has been selected. </div>;
  }

  function Display({ display }: { display: string }) {
    if (display === "ready") {
      return displayReady();
    } else {
      return displayNotReady();
    }
  }

  function getPokemonWaitingIcon() {
    if (pokemonReturned == POKEMON_HAS_RETURNED.WAITING) {
      return <GiPokecog style={{ animation: "rotation 2s infinite linear" }} />;
    }
  }
  // maxWidth="60%">
  return (
    <>
      <Card sx={sx}>
        <CardContent>
          <div style={{ textAlign: "center" }}>
            Hello Pokemon Trainer {username}, what would you like to do?
          </div>

          <div style={{ textAlign: "center" }}>
            {LoginInputBox(updateAndInitialiseUser, sx)}
          </div>
          <br />
          <div style={{ textAlign: "center" }}>
            <Display display={display} />
          </div>
          <Button
            sx={sx}
            disabled={!pokemon}
            fullWidth={true}
            onClick={() => {
              createBattle(pokemon);
            }}
            variant="contained"
            startIcon={<GiBattleGear size="1rem" />}
            endIcon={<GiBattleGear size="1rem" />}
            color="error"
          >
            Create Battle
          </Button>
          <br />
          <br />
          <div style={{ textAlign: "center" }}>
            {JoinRoomInputBox(pokemon, sx)}
          </div>
          <br />
          <br />
          <Button
            sx={sx}
            disabled={!username}
            fullWidth={true}
            variant="contained"
            size="large"
          >
            <Link
              style={{ textDecoration: "none" }}
              to={`../PokemonListScreen/${username}`}
            >
              View Pokemon ({noNewPokemon}){" "}
            </Link>
            {getPokemonWaitingIcon()}
          </Button>
          <br />
          <br />
          <Button
            sx={sx}
            disabled={!username}
            fullWidth={true}
            variant="contained"
            size="large"
            startIcon={<MdCatchingPokemon size="1rem" />}
            endIcon={<MdCatchingPokemon size="1rem" />}
          >
            <Link
              style={{ textDecoration: "none" }}
              to={`../PokemonCaptureScreen/${username}`}
            >
              Capture Pokemon!
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
