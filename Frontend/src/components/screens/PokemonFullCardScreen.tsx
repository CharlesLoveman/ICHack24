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
import { PokemonMoveCard } from "../pokedex/PokemonMoveCard";
import { StatDisplay } from "../pokedex/StatsDisplay";

function MovesDisplay(attacks: Attack[] | undefined) {
  if (attacks) {
    return attacks.map((move) => (
      <PokemonMoveCard attack={move}></PokemonMoveCard>
    ));
  } else {
    return <></>;
  }
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
