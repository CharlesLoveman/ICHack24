import "./App.css";

import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { GlobalData, useSetupGlobalData } from "./hooks/useSetupGlobalData";
import { getBrowserRouter } from "./components/BrowserRouter";
import { useTheme } from "./hooks/useTheme";
import { loadLocalStorage } from "./hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { POKEMON_HAS_RETURNED } from "./types";
import { socket } from "./socket";

export default function App() {
  const localStorageData = loadLocalStorage();
  const data = useSetupGlobalData(localStorageData);
  const theme = useTheme();

  const [noClicks, setNoClicks] = useState<number>(0);

  const router = getBrowserRouter({ noClicks, setNoClicks });

  useEffect(() => {
    if (data.pokemonReturned === POKEMON_HAS_RETURNED.WAITING) {
      const interval = setInterval(() => {
        if (!data.username) return;
        socket.emit("requestCreationUpdate", { username: data.username });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [data.pokemonReturned]);

  return (
    <GlobalData.Provider value={data}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </GlobalData.Provider>
  );
}
