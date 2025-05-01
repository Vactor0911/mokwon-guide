import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { isDrawerOpenAtom } from "../states";
import DrawerMenu from "./DrawerMenu";

const Header = () => {
  // 드로어 메뉴 열림 관련
  const setIsDrawerOpen = useSetAtom(isDrawerOpenAtom);

  const handleIsDrawerOpen = useCallback(
    (newIsDrawerOpen: boolean) => () => {
      setIsDrawerOpen(newIsDrawerOpen);
    },
    [setIsDrawerOpen]
  );

  return (
    <>
      {/* 헤더 */}
      <AppBar position="relative">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            sx={{
              color: "white",
            }}
            onClick={handleIsDrawerOpen(true)}
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          <Typography
            variant="h3"
            fontSize={{
              xs: "1.25rem",
              sm: "1.75rem",
            }}
            sx={{ color: "white" }}
          >
            목원 길잡이
          </Typography>

          <IconButton
            edge="end"
            sx={{
              color: "white",
            }}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 드로어 메뉴 */}
      <DrawerMenu />
    </>
  );
};

export default Header;
