import { createTheme, PaletteMode, responsiveFontSizes } from "@mui/material";

// 공통 색상
const commonPalette = {
  primary: {
    main: "#ac1d3d",
  },
  secondary: {
    main: "#69172a",
  },
};

// 타이포그래피 설정
const typography = {
  fontFamily: ["Noto Sans KR", "sans-serif"].join(","),
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
};

// 컴포넌트 설정
const getComponents = (mode: PaletteMode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: mode === "dark" ? "#1f1f1f" : "#ffffff",
        transition: "background-color 0.3s ease, color 0.3s ease",
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: "1em",
      },
    },
  },
  MuiSkeleton: {
    defaultProps: {
      animation: "wave" as const,
    },
  },
});

// 라이트 테마
export const createLightTheme = () =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: "light",
        ...commonPalette,
        info: {
          main: "#f2f2f2",
        },
        divider: "#797979",
        text: {
          primary: "#404040",
          secondary: "#797979",
        },
        background: {
          default: "#ffffff",
          paper: "#ffffff",
        },
      },
      typography,
      components: getComponents("light"),
    })
  );

// 다크 테마
export const createDarkTheme = () =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: "dark",
        ...commonPalette,
        info: {
          main: "#2d2d2d",
        },
        divider: "#454545",
        text: {
          primary: "#cccccc",
          secondary: "#9d9d9d",
        },
        background: {
          default: "#1f1f1f",
          paper: "#2d2d2d",
        },
      },
      typography,
      components: getComponents("dark"),
    })
  );

export const theme = createTheme({
  colorSchemes: {
    light: createLightTheme(),
    dark: createDarkTheme(),
  },
});
