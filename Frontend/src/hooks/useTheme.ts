import { PaletteColor, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    navigation?: PaletteColor;
  }
  // allow configuration using `createTheme()`
  interface PaletteOptions {
    navigation?: PaletteColor;
  }

  interface Theme {
    palette: Palette;
  }
  interface ThemeOptions {
    palette?: PaletteOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    navigation: true;
  }
}

export function useTheme() {
  const { palette } = createTheme();
  const { augmentColor } = palette;
  const createColor = (mainColor: string) =>
    augmentColor({ color: { main: mainColor } });

  const theme = createTheme({
    typography: {
      fontFamily: "Silkscreen",
    },
    palette: {
      navigation: createColor("#FFFFFF"),
    },
    components: {
      MuiCardHeader: {
        defaultProps: {},
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderRadius: "0rem",
            borderWidth: "0.2rem",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: "contained",
          disableElevation: true,
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            // margin: "0.5rem",
            padding: "0.5rem",
            borderRadius: "0rem",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            padding: "0.3rem",
            margin: "1rem",
            borderWidth: "0.3rem",
            borderColor: "black",
          },
        },
      },
    },
  });
  return theme;
}
