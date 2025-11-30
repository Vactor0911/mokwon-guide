import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { isDrawerOpenAtom, isSearchDrawerOpenAtom } from "../states";
import DrawerMenu from "./DrawerMenu";
import SearchDrawer from "./SearchDrawer";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate(); // 리다이렉트 네비게이션
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

  // 로고 클릭
  const handleLogoClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <>
      {/* 헤더 */}
      <AppBar
        color="primary"
        enableColorOnDark
        position="relative"
        sx={{
          zIndex: 1100,
        }}
      >
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
          <Typography
            variant="h4"
            sx={{ color: "white", cursor: "pointer" }}
            onClick={handleLogoClick}
          >
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
