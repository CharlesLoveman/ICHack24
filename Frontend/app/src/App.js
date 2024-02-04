import './App.css';

import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import PokemonCard from './components/PokemonCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainScreen from './screens/MainScreen';
import Root from './Root';

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import WaitingRoomScreen from './screens/WaitingRoomScreen';

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
      }
    ]
  }
]);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}