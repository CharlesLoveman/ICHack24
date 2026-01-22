import "./App.css";

import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MainScreen from "./components/screens/MainScreen";
import Root from "./Root";
import axios from "axios";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import WaitingRoomScreen from "./components/screens/WaitingRoomScreen";
import PokemonBattleScreen from "./components/screens/PokemonBattleScreen";
import PokemonListScreen from "./components/screens/PokemonListScreen";
import PokemonCaptureScreen from "./components/screens/PokemonCaptureScreen";
import { createContext } from "react";
import PokemonFullCardScreen from "./components/screens/PokemonFullCardScreen";
import { Pokemon, BattleData, BattleHP } from "./sharedTypes";
import { backendAddress } from "./env";
import {
  BATTLE_RESULT,
  GlobalContextType,
  POKEMON_HAS_RETURNED,
} from "./types";

const theme = createTheme({
  typography: {
    fontFamily: "Silkscreen",
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Navigate to="MainScreen" replace />,
      },
      {
        path: "MainScreen/",
        element: <MainScreen />,
      },
      {
        path: "WaitingRoomScreen/:game_id/",
        element: <WaitingRoomScreen />,
      },
      {
        path: "PokemonBattleScreen/:game_id/",
        element: <PokemonBattleScreen />,
      },
      {
        path: "PokemonListScreen/:id/",
        element: <PokemonListScreen />,
        loader: async ({ params }) => {
          return (await axios.get(`${backendAddress}/ListPokemon/${params.id}`))
            .data;
        },
      },
      {
        path: "PokemonCaptureScreen/:id/",
        element: <PokemonCaptureScreen />,
      },
      {
        path: "PokemonFullCardScreen/:id/",
        element: <PokemonFullCardScreen />,
      },
    ],
  },
]);

const GlobalData = createContext<GlobalContextType | null>(null);

export { GlobalData };

export default function App() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonReturned, setPokemonReturned] = useState<POKEMON_HAS_RETURNED>(
    POKEMON_HAS_RETURNED.RETURNED
  );
  const [noNewPokemon, setNoNewPokemon] = useState<number>(0);
  const [viewPokemon, setViewPokemon] = useState<Pokemon | undefined>(
    undefined
  );
  const [battleData, setBattleData] = useState<BattleData | undefined>(
    undefined
  );
  const [newTurn, setNewTurn] = useState<boolean>(false);
  const [battleResult, setBattleResult] = useState<BATTLE_RESULT | undefined>(
    undefined
  );
  const [battleHP, setBattleHP] = useState<BattleHP | undefined>(undefined);

  return (
    <GlobalData.Provider
      value={{
        username,
        setUsername,
        pokemon,
        setPokemon,
        pokemonReturned,
        setPokemonReturned,
        noNewPokemon,
        setNoNewPokemon,
        viewPokemon,
        setViewPokemon,
        battleData,
        setBattleData,
        newTurn,
        setNewTurn,
        battleResult,
        setBattleResult,
        battleHP,
        setBattleHP,
      }}
    >
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </GlobalData.Provider>
  );
}
