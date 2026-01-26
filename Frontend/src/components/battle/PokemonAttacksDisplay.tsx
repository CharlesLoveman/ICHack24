import Attack from "./Attack";
import { Grid } from "@mui/material";
import { Pokemon, Attack as IAttack } from "../../sharedTypes";
import { PokemonMoveDisplay } from "./PokemonMoveDisplay";
import { useState } from "react";
import { Title } from "../layout/Title";

interface PokemonAttacksDisplayProps {
  pokemon: Pokemon;
  onAttack: (attack: IAttack) => void;
  chosenAttack: IAttack | undefined;
}

export default function PokemonAttacksDisplay({
  pokemon,
  onAttack,
  chosenAttack,
}: PokemonAttacksDisplayProps) {
  const [viewingAttack, setViewingAttack] = useState<number | undefined>(
    undefined
  );

  const viewAttack = (index: number) => {
    setViewingAttack(index);
  };

  return (
    <>
      {viewingAttack !== undefined ? (
        <PokemonMoveDisplay
          attack={pokemon.attacks[viewingAttack]}
          onClose={() => setViewingAttack(undefined)}
        ></PokemonMoveDisplay>
      ) : (
        <>
          <Title color="#208c8e">Move selection</Title>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
            sx={{ p: 2 }}
          >
            {pokemon.attacks.map((attack: IAttack, index: number) => (
              <Grid item xs={6} key={index}>
                <Attack
                  attack={attack}
                  isChosen={attack === chosenAttack}
                  onAttack={onAttack}
                  disabled={chosenAttack !== undefined}
                  onClickInfo={() => viewAttack(index)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
