import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TbPokeball } from "react-icons/tb";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import { Pokemon, PokemonStats, Attack } from "../../sharedTypes";
import { useGlobalData } from "../../hooks/useGlobalData";

function StatDisplay(stats: PokemonStats | undefined) {
  if (stats) {
    return (
      <>
        <div>HP: {stats.hp}</div>
        <div>Attack: {stats.attack}</div>
        <div>Sp. Attack: {stats["special_attack"]}</div>
        <div>Defence: {stats.defence}</div>
        <div>Sp. Defence: {stats["special_defence"]}</div>
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
      <div>Name: {attack.name} </div>
      <div>Type: {attack.element}</div>
      <br />
    </>
  );
}

export default function PokemonFullCardScreen() {
  const { setPokemon, viewPokemon, setViewPokemon } = useGlobalData();
  const [cardPokemon, setCardPokemon] = useState<Pokemon | undefined>(
    undefined
  );

  console.log("henlo");

  useEffect(() => {
    console.log("hi");
    console.log(viewPokemon);
    setCardPokemon(viewPokemon);
    setViewPokemon(undefined);
  }, []);

  console.log(cardPokemon);

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
            Name: {cardPokemon?.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Type: {cardPokemon?.element}
          </Typography>
          <Typography variant="h6" component="div">
            Description
          </Typography>
          <Typography variant="body2">
            {cardPokemon?.description || ""}
          </Typography>
          <br />
          <Typography variant="h6" component="div">
            Stats
          </Typography>
          <Typography variant="body2">
            {StatDisplay(cardPokemon?.stats)}
          </Typography>
          <br />
          <Typography variant="h6" component="div">
            Moves
          </Typography>
          <Typography variant="body2">
            {MovesDisplay(cardPokemon?.attacks)}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setPokemon(cardPokemon ?? null)}
          >
            {" "}
            <TbPokeball /> Select{" "}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
