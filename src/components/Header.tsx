import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { isDrawerOpenAtom, isSearchDrawerOpenAtom } from "../states";
import DrawerMenu from "./DrawerMenu";
import SearchDrawer from "./SearchDrawer";

const Header = () => {
  const setIsDrawerOpen = useSetAtom(isDrawerOpenAtom); // 드로어 메뉴 열림 관련
  const setIsSearchDrawerOpen = useSetAtom(isSearchDrawerOpenAtom); // 검색 드로어 열림 관련

  // 드로어 메뉴 열림 설정
  const handleIsDrawerOpen = useCallback(
    (newIsDrawerOpen: boolean) => () => {
      setIsDrawerOpen(newIsDrawerOpen);
    },
    [setIsDrawerOpen]
  );

  // 검색 드로어 열림 설정
  const handleSearchDrawerOpen = useCallback(() => {
    setIsSearchDrawerOpen(true);
  }, [setIsSearchDrawerOpen]);

  return (
    <>
      {/* 헤더 */}
      <AppBar position="relative">
        <Toolbar sx={{ justifyContent: "space-between", boxShadow: 3 }}>
          {/* 메뉴 버튼 */}
          <IconButton
            edge="start"
            size="small"
            sx={{
              color: "white",
            }}
            onClick={handleIsDrawerOpen(true)}
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          {/* 로고 */}
          <Typography variant="h4" sx={{ color: "white" }}>
            목원 길잡이
          </Typography>

          {/* 검색 버튼 */}
          <IconButton
            edge="end"
            size="small"
            sx={{
              color: "white",
            }}
            onClick={handleSearchDrawerOpen}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 드로어 메뉴 */}
      <DrawerMenu />

      {/* 검색 드로어 */}
      <SearchDrawer />
    </>
  );
};

export default Header;
