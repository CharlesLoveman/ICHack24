import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "../Root";
import axios from "axios";
import MainScreen from "./screens/MainScreen";
import WaitingRoomScreen from "./screens/WaitingRoomScreen";
import PokemonBattleScreen from "./screens/PokemonBattleScreen";
import PokemonListScreen from "./screens/PokemonListScreen";
import PokemonCaptureScreen from "./screens/PokemonCaptureScreen";
import PokemonFullCardScreen from "./screens/PokemonFullCardScreen";
import { backendAddress } from "../env";

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
            return (
              await axios.get(`${backendAddress}/ListPokemon/${params.id}`)
            ).data;
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
