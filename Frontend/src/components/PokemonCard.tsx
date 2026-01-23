import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TbPokeball } from "react-icons/tb";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Pokemon, PokemonStats } from "../sharedTypes";
import { publicFolder } from "../env";
import { useGlobalData } from "../hooks/useGlobalData";

function StatDisplay({ stats }: { stats: PokemonStats }) {
  return (
    <>
      HP: {stats.hp} <br />
      Attack: {stats.attack} <br />
      Sp. Attack: {stats.special_attack} <br />
      Defence: {stats.defence} <br />
      Sp. Defence: {stats.special_defence} <br />
      Speed: {stats.speed} <br />
    </>
  );
}

interface PokemonCardProps {
  pokemon: Pokemon;
  isNew: boolean;
}

export default function PokemonCard({ pokemon, isNew }: PokemonCardProps) {
  const data = useGlobalData();
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
        <br />
        <Typography variant="body2">
          <StatDisplay stats={pokemon.stats} />
        </Typography>
        <br></br>
        <Button
          onClick={() => setPokemon(pokemon)}
          color="secondary"
          variant="contained"
        >
          {" "}
          <TbPokeball /> Select{" "}
        </Button>
        <Link
          to={`../PokemonFullCardScreen/${1}`}
          onClick={() => setViewPokemon(pokemon)}
        >
          <Button color="info" variant="contained">
            {" "}
            View{" "}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
