import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TbPokeball } from "react-icons/tb";
import { Button, CardHeader, Collapse } from "@mui/material";
import { Link } from "react-router-dom";
import { IPokemon } from "../../sharedTypes";
import { assetsFolder } from "../../env";
import { useGlobalData } from "../../hooks/useGlobalData";
import styled from "styled-components";
import { lightGrey } from "../../utils/colors";
import { socket } from "../../socket";
import { useState } from "react";
import { DownArrowButton } from "../layout/DownArrowButton";

interface PokemonCardProps {
  pokemon: IPokemon;
  isNew?: boolean;
  canDelete?: boolean;
  canSelect?: boolean;
  canAddToUser?: boolean;
  onDelete?: (id: string) => void;
  expandable?: boolean;
}

export const PokemonCardContainer = styled.div`
  // padding: 1rem;
  padding: 0;
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
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

export const ColumnLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export default function PokemonCard({
  pokemon,
  isNew,
  canDelete = false,
  canSelect = true,
  canAddToUser = false,
  expandable = true,
  onDelete,
}: PokemonCardProps) {
  const data = useGlobalData();
  const setPokemon = data.setPokemon;
  const isSelected = pokemon?.id === data.pokemon?.id;

  const backgroundColor = isSelected ? "lightblue" : isNew ? "khaki" : "white";

  const [expanded, setExpanded] = useState<boolean>(false);

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_: boolean) => {},
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
          title={
            <ColumnLayout>
              <PokemonNameContainer style={{ fontSize: "1.5rem" }}>
                {pokemon.name}
              </PokemonNameContainer>
              <DownArrowButton
                buttonProps={{ onClick: () => setExpanded(!expanded) }}
                iconProps={{ size: 40 }}
              />
            </ColumnLayout>
          }
          subheader={
            <PokemonTypeContainer style={{ fontSize: "0.8rem" }}>
              {pokemon.element}
            </PokemonTypeContainer>
          }
        ></CardHeader>

        <Collapse in={!expandable || expanded} timeout="auto" unmountOnExit>
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

              <Button
                component={Link}
                to={`../pokemon/${pokemon.id}`}
                color="info"
              >
                View Details
              </Button>
              {canDelete ? (
                <Button onClick={() => deletePokemon(pokemon.id)} color="error">
                  Delete
                </Button>
              ) : (
                <></>
              )}
            </CardActions>
          </CardContent>
        </Collapse>
      </Card>
    </PokemonCardContainer>
  );
}
