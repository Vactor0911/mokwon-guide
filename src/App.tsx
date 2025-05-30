import { CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router";
import { About, Detail, Main } from "./pages";
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
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/mokwon-guide/">
          <Header />
          <Stack minHeight="calc(100vh - 64px)">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/about" element={<About />} />
              <Route path="/detail/*" element={<Detail />} />
            </Routes>
          </Stack>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
