import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TbPokeball } from "react-icons/tb";
import { Button, CardHeader } from "@mui/material";
import { Link } from "react-router-dom";
import { Pokemon } from "../../sharedTypes";
import { assetsFolder } from "../../env";
import { useGlobalData } from "../../hooks/useGlobalData";
import styled from "styled-components";
import { lightGrey } from "../../utils/colors";
import { socket } from "../../socket";

interface PokemonCardProps {
  pokemon: Pokemon;
  isNew?: boolean;
  canDelete?: boolean;
  canSelect?: boolean;
  canAddToUser?: boolean;
  onDelete?: (id: string) => void;
}

export const PokemonCardContainer = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  margin: 0.5rem; // 3rem for DESKTOP
`;

export const PokemonNameContainer = styled.h3`
  margin: 0 0 0.5rem 0;
`;

export const PokemonTypeContainer = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: ${lightGrey};
  border-radius: 4px;
  font-size: 0.8rem;
`;

export const CardLayout = styled.div`
  display: flex;
  flex-direction: column; // row for DESKTOP
  gap: 1rem;
`;

/**
 * Differences between Mobile and Desktop
 * Desktop would prefer row cards
 * Desktop would have image on right (i.e. at the bottom of the elements)
 * Desktop must limit the width; not the height
 */

export const PokemonDetails = styled.div``;

export const PokemonImage = styled.div`
  flex: 0 0 auto;
`;

export const CardActions = styled.div`
  margin-top: 1rem;
  > * {
    margin: 1rem;
  }
`;

export default function PokemonCard({
  pokemon,
  isNew,
  canDelete = false,
  canSelect = true,
  canAddToUser = false,
  onDelete,
}: PokemonCardProps) {
  const data = useGlobalData();
  const setPokemon = data.setPokemon;
  const isSelected = pokemon?.id === data.pokemon?.id;

  const backgroundColor = isSelected ? "lightblue" : isNew ? "khaki" : "white";

  function deletePokemon(id: string) {
    socket.emit("deletePokemon", { pokemon_id: id }, (succeeded: boolean) => {
      if (succeeded) onDelete?.(pokemon.id);
    });
  }

  function addToUser(id: string) {
    if (data.username === undefined) return;
    socket.emit(
      "addPokemonToUser",
      { pokemon_id: id, username: data.username },
      (_: boolean) => {}
    );
  }

  return (
    <PokemonCardContainer>
      <Card
        sx={{
          backgroundColor: backgroundColor,
        }}
        elevation={0}
      >
        <CardHeader
          title={<PokemonNameContainer>{pokemon.name}</PokemonNameContainer>}
          subheader={
            <PokemonTypeContainer>{pokemon.element}</PokemonTypeContainer>
          }
        ></CardHeader>

        <CardContent>
          <CardLayout>
            <PokemonImage>
              <img
                src={assetsFolder + "/" + pokemon.image_id}
                // width={500} for DESKTOP
                height={180}
              ></img>
            </PokemonImage>
            <PokemonDetails>
              <Typography variant="body2">{pokemon.description}</Typography>
            </PokemonDetails>
          </CardLayout>
          <CardActions>
            {canSelect ? (
              <Button
                startIcon={<TbPokeball />}
                onClick={() => setPokemon(pokemon)}
                color="secondary"
              >
                Select
              </Button>
            ) : (
              <></>
            )}
            {canAddToUser ? (
              <Button
                startIcon={<TbPokeball />}
                onClick={() => addToUser(pokemon.id)}
                color="warning"
              >
                Add to my Pokedex
              </Button>
            ) : (
              <></>
            )}

            <Link to={`../pokemon/${pokemon.id}`}>
              <Button color="info">View Details</Button>
            </Link>
            {canDelete ? (
              <Button onClick={() => deletePokemon(pokemon.id)} color="error">
                Delete
              </Button>
            ) : (
              <></>
            )}
          </CardActions>
        </CardContent>
      </Card>
    </PokemonCardContainer>
  );
}
