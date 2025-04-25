import { createTheme } from "@mui/material";

// MUI 테마 설정
export const theme = createTheme({
  palette: {
    primary: {
      main: "#ac1d3d",
    },
    secondary: {
      main: "#69172a",
    },
  },
  typography: {
    fontFamily: ["Noto Sans KR", "sans-serif"].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: "bold",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: "bold",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
});
