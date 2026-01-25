import { createBrowserRouter, Navigate, Params } from "react-router-dom";
import Root from "../Root";
import axios from "axios";
import HomeScreen from "./screens/HomeScreen";
import WaitingRoomScreen from "./screens/WaitingRoomScreen";
import PokemonBattleScreen from "./screens/PokemonBattleScreen";
import PokemonListScreen from "./screens/PokemonListScreen";
import PokemonCaptureScreen from "./screens/PokemonCaptureScreen";
import PokemonFullCardScreen from "./screens/PokemonFullCardScreen";
import { backendAddress } from "../env";
import { PokemonLayoutPage } from "./screens/PokemonLayoutPage";

const pokemonLoader = async ({ params }: { params: Params<string> }) => {
  return (await axios.get(`${backendAddress}/ListPokemon/${params.id}`)).data;
};

export const getBrowserRouter = () =>
  createBrowserRouter([
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
          element: <HomeScreen />,
        },
        {
          path: "WaitingRoomScreen/:game_id/",
          element: <WaitingRoomScreen />,
        },
        {
          path: "example/",
          element: <PokemonLayoutPage />,
        },
        {
          path: "PokemonBattleScreen/:game_id/",
          element: <PokemonBattleScreen />,
        },
        {
          path: "PokemonListScreen/:id/",
          element: <PokemonListScreen />,
          loader: pokemonLoader,
        },
        {
          path: "PokemonCaptureScreen/:id/",
          element: <PokemonCaptureScreen />,
        },
        {
          path: "PokemonFullCardScreen/:id/:pokemon_id/",
          element: <PokemonFullCardScreen />,
          loader: pokemonLoader,
        },
      ],
    },
  ]);
