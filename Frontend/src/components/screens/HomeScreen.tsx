import { useEffect, useState } from "react";
import JoinRoomInputBox from "../home/JoinRoomInputBox";
import { GiBattleGear } from "react-icons/gi";
import { MdCatchingPokemon } from "react-icons/md";

import { socket } from "../../socket";

import LoginInputBox from "../home/LoginInputBox";
import { TbPokeball } from "react-icons/tb";
import { GiPokecog } from "react-icons/gi";
import "./HomeScreen.css";
import { CreateBattleData, Pokemon } from "../../sharedTypes";
import { POKEMON_HAS_RETURNED } from "../../types";
import { useGlobalData } from "../../hooks/useGlobalData";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { LongButton } from "../layout/LongButton";
import { LinkButton } from "../layout/LinkButton";
import { ScrollableMain } from "../layout/ScrollableMain";

const HomeScreenContainer = styled.div`
  text-align: center;
  padding: 1rem;
  > * {
    margin-top: 1rem;
  }
`;

export default function HomeScreen() {
  const { username, pokemon, pokemonReturned, noNewPokemon } = useGlobalData();

  const [display, setDisplay] = useState("notReady");

  useEffect(() => {
    if (pokemon) {
      setDisplay("ready");
    } else {
      setDisplay("notReady");
    }
  }, [pokemon]);

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
      <HomeScreenContainer>
        <Typography variant="h6">
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
          linkProps={{ to: `../pokedex/${username}` }}
          buttonProps={{ fullWidth: true, disabled: !username }}
        >
          View Pokemon ({noNewPokemon}) {getPokemonWaitingIcon()}
        </LinkButton>

        <LinkButton
          linkProps={{ to: `../capture/${username}` }}
          buttonProps={{
            fullWidth: true,
            startIcon: <MdCatchingPokemon size="1rem" />,
            endIcon: <MdCatchingPokemon size="1rem" />,
            disabled: !username,
          }}
        >
          Capture Pokemon!
        </LinkButton>

        <LinkButton
          linkProps={{ to: `../global-pokedex` }}
          buttonProps={{ fullWidth: true, disabled: !username }}
        >
          View Global Pokedex
        </LinkButton>
      </HomeScreenContainer>
    </ScrollableMain>
  );
}
