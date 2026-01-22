import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { GlobalData } from "../App";
import { useContext } from "react";
import { TbPokeball } from "react-icons/tb";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Pokemon, PokemonStats } from "../sharedTypes";
import { GlobalContextType } from "../types";
import { publicFolder } from "../env";

function StatDisplay(stats: PokemonStats) {
  return (
    <>
      <div>HP: {stats.hp}</div>
      <div>Attack: {stats.attack}</div>
      <div>Sp. Attack: {stats.special_attack}</div>
      <div>Defence: {stats.defence}</div>
      <div>Sp. Defence: {stats.special_defence}</div>
      <div>Speed: {stats.speed}</div>
    </>
  );
}

export default function PokemonCard(pokemon: Pokemon, isNew: boolean) {
  const data = useContext(GlobalData) as GlobalContextType;
  const setPokemon = data.setPokemon;
  const setViewPokemon = data.setViewPokemon;

  const backgroundColor = isNew ? "khaki" : "white";

  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: backgroundColor,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          <img src={publicFolder + "/" + pokemon.image_id} width="100"></img>
        </Typography>
        <Typography variant="h5" component="div">
          Name: {pokemon.name} {isNew}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Type: {pokemon.element}
        </Typography>
        <Typography variant="body2">
          Description: {pokemon.description}
        </Typography>
        <Typography variant="body2">{StatDisplay(pokemon.stats)}</Typography>
        <Button onClick={() => setPokemon(pokemon)}>
          {" "}
          <TbPokeball /> Select{" "}
        </Button>
        <Button>
          {" "}
          <Link
            to={`../PokemonFullCardScreen/${1}`}
            onClick={() => setViewPokemon(pokemon)}
          >
            View
          </Link>{" "}
        </Button>
      </CardContent>
    </Card>
  );
}
