import {
  Box,
  Collapse,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { theme } from "../theme";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { isDrawerOpenAtom } from "../states";
import buildings from "../assets/buildings.json";
import Footer from "./Footer";
import DrawerNavLink from "./DrawerNavLink";

const DrawerMenu = () => {
  // 드로어 메뉴 열림 관련
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);

  const handleIsDrawerOpen = useCallback(
    (newIsDrawerOpen: boolean) => () => {
      setIsDrawerOpen(newIsDrawerOpen);
    },
    [setIsDrawerOpen]
  );

  // 아코디언 메뉴 열림 관련
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleToggleAccordion = useCallback(() => {
    setIsAccordionOpen((prev) => !prev);
  }, []);

  const handleCloseAll = useCallback(() => {
    setIsDrawerOpen(false);
    setIsAccordionOpen(false);
  }, [setIsDrawerOpen]);

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleIsDrawerOpen(false)}
      slotProps={{
        paper: {
          sx: {
            background: theme.palette.primary.main,
          },
        },
      }}
    >
      <Stack
        width="95vw"
        maxWidth="450px"
        minHeight="100%"
        justifyContent="space-between"
        padding={2}
        pb={0}
        sx={{
          background: theme.palette.primary.main,
        }}
      >
        <Stack spacing={5}>
          {/* 최상단 버튼 컨테이너 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
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

          {/* 페이지 네비게이션 */}
          <Stack spacing={3}>
            {[
              { to: "/", text: "교내 지도" },
              { to: "/about", text: "소개" },
            ].map((data, index) => (
              <DrawerNavLink to={data.to} onClick={handleCloseAll} key={index}>
                <Typography
                  variant="h5"
                  color="white"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  {data.text}
                </Typography>
              </DrawerNavLink>
            ))}

            {/* 건물 상세 버튼 */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                cursor: "pointer",
              }}
              onClick={handleToggleAccordion}
            >
              <Typography variant="h5" color="white">
                건물 상세
              </Typography>
              <ExpandMoreIcon
                fontSize="large"
                sx={{
                  color: "white",
                  mr: 1,
                  transform: isAccordionOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </Stack>

            {/* 건물 상세 컨테이너 */}
            <Collapse in={isAccordionOpen}>
              <Stack
                padding={2}
                spacing={2}
                sx={{
                  background: theme.palette.secondary.main,
                }}
              >
                {buildings.map((building) => (
                  <DrawerNavLink
                    key={building.id}
                    to={`/detail?building=${building.id}`}
                    onClick={handleCloseAll}
                  >
                    <Grid container spacing={1}>
                      <Grid size={1.5}>
                        <Typography variant="h5" color="white">
                          {building.id}
                        </Typography>
                      </Grid>
                      <Grid size={10.5}>
                        <Typography variant="h6" color="white" fontWeight={300}>
                          {building.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </DrawerNavLink>
                ))}
              </Stack>
            </Collapse>
          </Stack>
        </Stack>

        {/* 푸터 */}
        <Box>
          <Footer />
        </Box>
      </Stack>
    </Drawer>
  );
};

export default DrawerMenu;
