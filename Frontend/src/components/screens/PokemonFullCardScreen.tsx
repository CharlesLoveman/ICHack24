import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TbPokeball } from "react-icons/tb";
import { Button, CardActions, CardHeader } from "@mui/material";
import { useEffect } from "react";
import { Pokemon, Attack } from "../../sharedTypes";
import { useGlobalData } from "../../hooks/useGlobalData";
import { Title } from "../layout/Title";
import { ScrollableMain } from "../layout/ScrollableMain";
import {
  CardLayout,
  PokemonDetails,
  PokemonImage,
  PokemonNameContainer,
  PokemonTypeContainer,
} from "../pokedex/PokemonCard";
import { assetsFolder } from "../../env";
import { useLoaderData, useParams } from "react-router-dom";
import { DetailsCard } from "../DetailsCard";

interface OptionalPokemonStats {
  hp?: number;
  attack?: number;
  defence?: number;
  special_attack?: number;
  special_defence?: number;
  speed?: number;
}

function StatDisplay(stats: OptionalPokemonStats | undefined) {
  if (stats) {
    return (
      <>
        {stats.hp ? <Typography>HP: {stats.hp}</Typography> : <></>}
        {stats.attack ? <Typography>Attack: {stats.attack}</Typography> : <></>}
        {stats.special_attack ? (
          <Typography>Sp. Attack: {stats.special_attack}</Typography>
        ) : (
          <></>
        )}
        {stats.defence ? (
          <Typography>Defence: {stats.defence}</Typography>
        ) : (
          <></>
        )}
        {stats.special_defence ? (
          <Typography>Sp. Defence: {stats.special_defence}</Typography>
        ) : (
          <></>
        )}
        {stats.speed ? <Typography>Speed: {stats.speed}</Typography> : <></>}
      </>
    );
  } else {
    return <></>;
  }
}

function statsAreEmpty(stats: OptionalPokemonStats | undefined) {
  return (
    stats === undefined ||
    !(
      stats.attack ||
      stats.defence ||
      stats.hp ||
      stats.special_attack ||
      stats.special_defence ||
      stats.speed
    )
  );
}

function MoveStatDisplay(stats: OptionalPokemonStats | undefined) {
  return (
    <>
      {StatDisplay(stats)}
      {statsAreEmpty(stats) ? <Typography>Nothing</Typography> : <></>}
    </>
  );
}

function MovesDisplay(attacks: Attack[] | undefined) {
  if (attacks) {
    return attacks.map((move) => MoveDisplay(move));
  } else {
    return <></>;
  }
}

function MoveDisplay(attack: Attack) {
  return (
    <DetailsCard>
      <CardHeader
        title={<PokemonNameContainer>{attack.name}</PokemonNameContainer>}
        subheader={
          <PokemonTypeContainer style={{ backgroundColor: "#9c9c9c" }}>
            {attack.element}
          </PokemonTypeContainer>
        }
      ></CardHeader>
      <CardContent>
        <Typography>{attack.description}</Typography>
        <Typography>Power: {attack.power}</Typography>
        {attack.special ? (
          <Typography>Special: {attack.special}</Typography>
        ) : (
          <></>
        )}
        <CardHeader title="Effect on self"></CardHeader>
        <CardContent>
          <Typography>{MoveStatDisplay(attack.self_status_id)}</Typography>
        </CardContent>
        <CardHeader title="Effect on enemy"></CardHeader>
        <CardContent>
          <Typography>{MoveStatDisplay(attack.target_status_id)}</Typography>
        </CardContent>
      </CardContent>
    </DetailsCard>
  );
}

export default function PokemonFullCardScreen() {
  const { pokemon, setPokemon, viewPokemon, setViewPokemon } = useGlobalData();

  const isSelected = viewPokemon?.id === pokemon?.id;

  const backgroundColor = isSelected ? "lightblue" : "white";

  const pokemons = useLoaderData() as Pokemon[];
  const params = useParams<{ pokemon_id: string }>();

  useEffect(() => {
    const pokemon = pokemons.find(
      (pokemon) => pokemon.id === params.pokemon_id
    );
    if (pokemon) {
      setViewPokemon(pokemon);
    }
  }, []);

  return (
    <>
      <Title>Pokemon Details</Title>
      <ScrollableMain>
        <Card
          sx={{
            backgroundColor: backgroundColor,
          }}
          elevation={0}
        >
          <CardHeader
            title={
              <PokemonNameContainer>{viewPokemon?.name}</PokemonNameContainer>
            }
            subheader={
              <PokemonTypeContainer>
                {viewPokemon?.element}
              </PokemonTypeContainer>
            }
          ></CardHeader>

          <CardContent>
            <CardLayout>
              <PokemonImage>
                <img
                  src={assetsFolder + "/" + viewPokemon?.image_id}
                  // width={500} for DESKTOP
                  height={180}
                ></img>
              </PokemonImage>
              <PokemonDetails>
                <DetailsCard>
                  <CardHeader title="Description"></CardHeader>
                  <CardContent>
                    <Typography variant="body2">
                      {viewPokemon?.description}
                    </Typography>
                  </CardContent>
                </DetailsCard>
              </PokemonDetails>
              <DetailsCard>
                <CardHeader title={"Stats"}></CardHeader>

                <CardContent>{StatDisplay(viewPokemon?.stats)}</CardContent>
              </DetailsCard>
            </CardLayout>
          </CardContent>
          <CardHeader
            title={<Typography variant="h4">Moves</Typography>}
          ></CardHeader>
          <Typography variant="body2">
            {MovesDisplay(viewPokemon?.attacks)}
          </Typography>
          <CardActions>
            <Button
              startIcon={<TbPokeball />}
              onClick={() => setPokemon(viewPokemon ?? null)}
              color="secondary"
            >
              Select
            </Button>
          </CardActions>
        </Card>
      </ScrollableMain>
    </>
  );
}
