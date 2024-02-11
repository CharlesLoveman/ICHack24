import './App.css';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import PokemonCard from './components/PokemonCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainScreen from './components/screens/MainScreen';
import Root from './Root';
import axios from 'axios';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import WaitingRoomScreen from './components/screens/WaitingRoomScreen';
import PokemonBattleScreen from './components/screens/PokemonBattleScreen';
import PokemonListScreen from './components/screens/PokemonListScreen';
import PokemonCaptureScreen from './components/screens/PokemonCaptureScreen';
import { createContext } from 'react';

const theme = createTheme({
});


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Navigate to="MainScreen" replace />
      },
      {
        path: "MainScreen/",
        element: <MainScreen />
      },
      {
        path: "WaitingRoomScreen/:game_id/",
        element: <WaitingRoomScreen />
      },
      {
        path: "PokemonBattleScreen/",
        element: <PokemonBattleScreen />
      },
      {
        path: "PokemonListScreen/:id/",
        element: <PokemonListScreen />,
        loader: async ({ params }) => {
          return (await axios.get(`http://127.0.0.1:5000/ListPokemon/${params.id}`)).data;
        },
      },
      {
        path: "PokemonCaptureScreen/:id/",
        element: <PokemonCaptureScreen />
      }
    ]
  }
]);

const GlobalData = createContext(null)
export { GlobalData };

export default function App() {


  const [username, setUsername] = useState("")
  const [pokemon, setPokemon] = useState("")


  return (
    <GlobalData.Provider value={{ username, setUsername, pokemon, setPokemon }}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </GlobalData.Provider>
  );
}