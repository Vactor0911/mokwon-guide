import { CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router";
import { About, Detail, Main } from "./pages";
import Header from "./components/Header";

const App = () => {
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
