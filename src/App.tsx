import { CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Detail, Main } from "./pages";
import Header from "./components/Header";
import { useEffect } from "react";

const App = () => {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    setVh();

    window.addEventListener("resize", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);

  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <BrowserRouter basename="/mokwon-guide/">
        <Header />
        <Stack minHeight="calc(100vh - 64px)">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/detail/*" element={<Detail />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </Stack>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
