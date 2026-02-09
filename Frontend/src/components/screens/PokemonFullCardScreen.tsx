import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardHeader } from "@mui/material";
import { useEffect, useState } from "react";
import { IPokemon, IAttack } from "../../sharedTypes";
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
import { useLoaderData } from "react-router-dom";
import { DetailsCard } from "../pokedex/DetailsCard";
import { PokemonMoveCard } from "../pokedex/PokemonMoveCard";
import { StatDisplay } from "../pokedex/StatsDisplay";

function MovesDisplay(attacks: IAttack[] | undefined) {
  if (attacks) {
    return attacks.map((move) => (
      <PokemonMoveCard attack={move}></PokemonMoveCard>
    ));
  } else {
    return <></>;
  }
}

export default function PokemonFullCardScreen() {
  const { pokemon } = useGlobalData();

  const [viewPokemon, setViewPokemon] = useState<IPokemon | undefined>(
    undefined,
  );

  const isSelected = viewPokemon?.id === pokemon?.id;

  const backgroundColor = isSelected ? "lightblue" : "white";

  const loadedPokemon = useLoaderData() as IPokemon;

  useEffect(() => {
    if (loadedPokemon) {
      setViewPokemon(loadedPokemon);
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
        </Card>
      </ScrollableMain>
    </>
  );
}
