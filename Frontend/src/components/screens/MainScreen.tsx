import { useEffect, useState } from "react";
import JoinRoomInputBox from "../home/JoinRoomInputBox";
import { GiBattleGear } from "react-icons/gi";
import { MdCatchingPokemon } from "react-icons/md";
import "./styles.css";

import { socket } from "../../socket";

import LoginInputBox from "../home/LoginInputBox";
import { TbPokeball } from "react-icons/tb";
import { GiPokecog } from "react-icons/gi";
import "./MainScreen.css";
import { CreateBattleData, Pokemon } from "../../sharedTypes";
import { POKEMON_HAS_RETURNED } from "../../types";
import { useGlobalData } from "../../hooks/useGlobalData";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { LongButton } from "../LongButton";
import { LinkButton } from "../LinkButton";
import { ScrollableMain } from "../layout/ScrollableMain";

const MainScreenContainer = styled.div`
  text-align: center;
  padding: 1rem;
  > * {
    margin-top: 1rem;
  }
`;

export default function MainScreen() {
  const { username, pokemon, pokemonReturned, noNewPokemon } = useGlobalData();

  const [display, setDisplay] = useState("notReady");

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

  function getPokemonWaitingIcon() {
    if (pokemonReturned == POKEMON_HAS_RETURNED.WAITING) {
      return <GiPokecog style={{ animation: "rotation 2s infinite linear" }} />;
    }
  }

  return (
    <ScrollableMain>
      <MainScreenContainer>
        <Typography>
          {username ? (
            <>Hello Pokemon Trainer {username}, what would you like to do?</>
          ) : (
            <>Welcome Pokemon Trainer! Please log in</>
          )}
        </Typography>

        <LoginInputBox />
        <div>
          {display !== "ready" ? (
            <Typography>No Pokemon has been selected. </Typography>
          ) : (
            <Typography>
              <TbPokeball /> {pokemon?.name} is ready to go!{" "}
            </Typography>
          )}
        </div>
        <LongButton
          disabled={!pokemon}
          onClick={() => {
            createBattle(pokemon);
          }}
          startIcon={<GiBattleGear size="1rem" />}
          endIcon={<GiBattleGear size="1rem" />}
          color="error"
        >
          Create Battle
        </LongButton>
        <JoinRoomInputBox pokemon={pokemon} />
        <LinkButton
          linkProps={{ to: `../PokemonListScreen/${username}` }}
          buttonProps={{ fullWidth: true }}
        >
          View Pokemon ({noNewPokemon}) {getPokemonWaitingIcon()}
        </LinkButton>

        <LinkButton
          linkProps={{ to: `../PokemonCaptureScreen/${username}` }}
          buttonProps={{
            fullWidth: true,
            startIcon: <MdCatchingPokemon size="1rem" />,
            endIcon: <MdCatchingPokemon size="1rem" />,
          }}
        >
          Capture Pokemon!
        </LinkButton>
      </MainScreenContainer>
    </ScrollableMain>
  );
}
