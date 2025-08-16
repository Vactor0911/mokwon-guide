import { createTheme, responsiveFontSizes } from "@mui/material";

// MUI 테마 설정
export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#ac1d3d",
      },
      secondary: {
        main: "#69172a",
      },
      info: {
        main: "#f2f2f2",
      },
    },
    typography: {
      fontFamily: ["Noto Sans KR", "sans-serif"].join(","),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "1em",
          },
        },
      },
    },
  })
);
