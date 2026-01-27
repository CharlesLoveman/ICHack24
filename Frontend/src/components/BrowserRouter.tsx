import { createBrowserRouter, Navigate, Params } from "react-router-dom";
import Root from "../Root";
import HomeScreen from "./screens/HomeScreen";
import WaitingRoomScreen from "./screens/WaitingRoomScreen";
import PokemonBattleScreen from "./screens/PokemonBattleScreen";
import UserPokedexScreen from "./screens/UserPokedexScreen";
import PokemonCaptureScreen from "./screens/PokemonCaptureScreen";
import PokemonFullCardScreen from "./screens/PokemonFullCardScreen";
import { PokemonLayoutPage } from "./screens/PokemonLayoutPage";
import { socket } from "../socket";
import { Pokemon, PokemonsData } from "../sharedTypes";
import GlobalPokedexScreen from "./screens/GlobalPokedexScreen";

const onePokemonLoader = async ({ params }: { params: Params<string> }) => {
  return await new Promise<Pokemon>((resolve, reject) => {
    if (!params.id) {
      reject("No id provided");
      return;
    }

    socket.emit(
      "requestOnePokemon",
      { pokemon_id: params.id },
      (data: Pokemon) => {
        resolve(data);
      }
    );
  });
};

const userPokemonLoader = async ({ params }: { params: Params<string> }) => {
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

const allPokemonLoader = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return await new Promise<PokemonsData>((resolve, _) => {
    socket.emit("requestAllPokemons", (data: PokemonsData) => {
      resolve(data);
    });
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
          element: <Navigate to="home" replace />,
        },
        {
          path: "home/",
          element: <HomeScreen />,
        },
        {
          path: "waiting-room/:game_id/",
          element: <WaitingRoomScreen />,
        },
        {
          path: "example/",
          element: <PokemonLayoutPage />,
        },
        {
          path: "battle/:game_id/",
          element: <PokemonBattleScreen />,
        },
        {
          path: "pokedex/:id/",
          element: <UserPokedexScreen />,
          loader: userPokemonLoader,
        },
        {
          path: "global-pokedex/",
          element: <GlobalPokedexScreen />,
          loader: allPokemonLoader,
        },
        {
          path: "capture/:id/",
          element: <PokemonCaptureScreen />,
        },
        {
          path: "pokemon/:id/",
          element: <PokemonFullCardScreen />,
          loader: onePokemonLoader,
        },
      ],
    },
  ]);
