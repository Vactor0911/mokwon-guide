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
  },
});
