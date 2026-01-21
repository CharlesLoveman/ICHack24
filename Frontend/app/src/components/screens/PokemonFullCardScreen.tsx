import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { GlobalData } from "../../App";
import { useContext } from "react";
import { TbPokeball } from "react-icons/tb";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

import NavBar from "../NavBar";
import { GlobalContextType, Pokemon, PokemonStats, Attack } from "../../types";

function StatDisplay(stats: PokemonStats | undefined) {
  if (stats) {
    return (
      <>
        <div>HP: {stats.hp}</div>
        <div>Attack: {stats.attack}</div>
        <div>Sp. Attack: {stats["special attack"]}</div>
        <div>Defence: {stats.defence}</div>
        <div>Sp. Defence: {stats["special defence"]}</div>
        <div>Speed: {stats.speed}</div>
      </>
    );
  } else {
    return <></>;
  }
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
    <>
      {/* @ts-ignore - 'element' might be missing from the Attack type definition but exists in data */}
      <div>Name: {attack.name} </div>
      <div>Type: {attack.element}</div>
      <br />
    </>
  );
}

export default function PokemonFullCardScreen() {
  const data = useContext(GlobalData) as GlobalContextType;
  const setPokemon = data.setPokemon;
  const [pokemon, setter] = useState<Partial<Pokemon>>({});

  console.log("henlo");

  useEffect(() => {
    console.log("hi");
    console.log(data.viewPokemon);
    setter(data.viewPokemon);
    data.setViewPokemon({});
  }, []);

  console.log(pokemon);

  return (
    <>
      {NavBar()}
      <Card
        sx={{
          minWidth: 275,
          backgroundColor: "white",
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Name: {pokemon.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Type: {pokemon.element}
          </Typography>
          <Typography variant="h6" component="div">
            Description
          </Typography>
          <Typography variant="body2">
            {/* @ts-ignore - description might be missing on Partial<Pokemon> */}
            {pokemon.description || ""}
          </Typography>
          <br />
          <Typography variant="h6" component="div">
            Stats
          </Typography>
          <Typography variant="body2">{StatDisplay(pokemon.stats)}</Typography>
          <br />
          <Typography variant="h6" component="div">
            Moves
          </Typography>
          <Typography variant="body2">
            {MovesDisplay(pokemon.attacks)}
          </Typography>
          <Button onClick={() => setPokemon(pokemon as Pokemon)}>
            {" "}
            <TbPokeball /> Select{" "}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
