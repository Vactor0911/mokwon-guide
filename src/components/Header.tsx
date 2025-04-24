import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useState } from "react";
import { theme } from "../theme";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleIsDrawerOpen = useCallback(
    (newIsDrawerOpen: boolean) => () => {
      setIsDrawerOpen(newIsDrawerOpen);
    },
    [setIsDrawerOpen]
  );

  return (
    <>
      {/* 헤더 */}
      <AppBar>
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

          <Typography variant="h3">목원 길잡이</Typography>

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
      <Drawer open={isDrawerOpen} onClose={handleIsDrawerOpen(false)}>
        <Box
          role="presentation"
          width="100vw"
          maxWidth="450px"
          height="100%"
          padding={1}
          sx={{
            background: theme.palette.primary.main,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              pl={1}
              variant="h4"
              sx={{
                color: "white",
              }}
            >
              목원 길잡이
            </Typography>

            <IconButton
              sx={{
                color: "white",
              }}
              onClick={handleIsDrawerOpen(false)}
            >
              <CloseRoundedIcon fontSize="large" />
            </IconButton>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
