import "./App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { GlobalData, useSetupGlobalData } from "./hooks/useSetupGlobalData";
import { getBrowserRouter } from "./components/BrowserRouter";

const theme = createTheme({
  typography: {
    fontFamily: "Silkscreen",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: "0.5rem",
        },
      },
    },
  },
});

const router = getBrowserRouter();

export default function App() {
  const data = useSetupGlobalData();

  return (
    <GlobalData.Provider value={data}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </GlobalData.Provider>
  );
}
