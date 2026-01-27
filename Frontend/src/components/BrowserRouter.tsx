import { createBrowserRouter, Navigate, Params } from "react-router-dom";
import Root from "../Root";
import HomeScreen from "./screens/HomeScreen";
import WaitingRoomScreen from "./screens/WaitingRoomScreen";
import PokemonBattleScreen from "./screens/PokemonBattleScreen";
import PokemonListScreen from "./screens/PokemonListScreen";
import PokemonCaptureScreen from "./screens/PokemonCaptureScreen";
import PokemonFullCardScreen from "./screens/PokemonFullCardScreen";
import { PokemonLayoutPage } from "./screens/PokemonLayoutPage";
import { socket } from "../socket";
import { PokemonsData } from "../sharedTypes";

const pokemonLoader = async ({ params }: { params: Params<string> }) => {
  return await new Promise<PokemonsData>((resolve, reject) => {
    if (!params.id) {
      reject("No id provided");
      return;
    }
    socket.emit(
      "requestUserPokemons",
      { username: params.id },
      (data: PokemonsData) => {
        resolve(data);
      }
    );
  });
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
