import "./App.css";

import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { GlobalData, useSetupGlobalData } from "./hooks/useSetupGlobalData";
import { getBrowserRouter } from "./components/BrowserRouter";
import { useTheme } from "./hooks/useTheme";

const router = getBrowserRouter();

export default function App() {
  const data = useSetupGlobalData();
  const theme = useTheme();

  return (
    <GlobalData.Provider value={data}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </GlobalData.Provider>
  );
}
