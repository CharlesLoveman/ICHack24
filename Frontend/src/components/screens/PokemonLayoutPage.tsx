import React from "react";
import styled from "styled-components";
import { Title } from "../layout/Title";
import { CopyrightFooter } from "../root/CopyrightFooter";
import { ScrollableMain } from "../layout/ScrollableMain";
import { lightGrey } from "../../utils/colors";

const PokemonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PokemonCardContainer = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
`;

const PokemonName = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const PokemonType = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: ${lightGrey};
  border-radius: 4px;
  font-size: 0.8rem;
`;

export const PokemonLayoutPage: React.FC = () => {
  // Data extracted from Backend/responses.txt
  const pokemonData = [
    { name: "Luminaurora", type: "Fairy/Psychic" },
    { name: "GitLuigi", type: "Psychic/Steel" },
    { name: "Aianoid", type: "Steel/Psychic" },
    { name: "Penguindroid", type: "Electric/Ice" },
    { name: "Scribblin", type: "Psychic/Normal" },
    { name: "Caprim", type: "Normal/Flying" },
    { name: "Llamplush", type: "Normal/Fairy" },
    { name: "Giftgiver", type: "Normal/Fairy" },
    { name: "Glacielle", type: "Ice/Fairy" },
    { name: "Fluctuate", type: "Psychic/Ghost" },
  ];

  // Duplicate list to ensure content overflows and scrolls
  const displayList = [...pokemonData, ...pokemonData, ...pokemonData];

  return (
    <>
      <Title>GenAI Pokedex</Title>

      <ScrollableMain>
        <PokemonList>
          {displayList.map((poke, index) => (
            <PokemonCardContainer key={index}>
              <PokemonName>{poke.name}</PokemonName>
              <PokemonType>{poke.type}</PokemonType>
            </PokemonCardContainer>
          ))}
        </PokemonList>
      </ScrollableMain>
      <CopyrightFooter />
    </>
  );
};
