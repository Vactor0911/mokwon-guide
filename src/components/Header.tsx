import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  Grid,
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
import Footer from "./Footer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router";

const buildings = [
  { id: 1, alpha: "A", name: "신학관" },
  { id: 2, alpha: "B", name: "문화콘텐츠관" },
  { id: 3, alpha: "C", name: "보건안전관" },
  { id: 4, alpha: "D", name: "공학관" },
  { id: 5, alpha: "E", name: "사회과학관" },
  { id: 6, alpha: "F", name: "음악관" },
  { id: 7, alpha: "G", name: "미술관" },
  { id: 8, alpha: "G1", name: "미술대학실습동" },
  { id: 9, alpha: "I", name: "캠퍼스타운" },
  { id: 10, alpha: "J", name: "(구) 신학관" },
  { id: 11, alpha: "M", name: "중앙도서관" },
  { id: 12, alpha: "N", name: "학생회관" },
  { id: 13, alpha: "O", name: "건축도시지원센터" },
  { id: 14, alpha: "O1", name: "창업보육센터" },
  { id: 15, alpha: "P", name: "체육관" },
  { id: 16, alpha: "R", name: "콘서트홀" },
];

interface NavLinkProps {
  to: string;
  children?: React.ReactNode;
}

const Header = () => {
  // 드로어 메뉴 열림 관련
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // 드로어 메뉴 닫기
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setIsAccordionOpen(false);
  }, []);

  // 공통 네비게이션 링크 컴포넌트
  const NavLink = (props: NavLinkProps) => {
    const { to, children, ...others } = props;
    return (
      <Link
        to={to}
        style={{ textDecoration: "none" }}
        onClick={handleCloseDrawer}
        {...others}
      >
        {children}
      </Link>
    );
  };

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
                variant="h3"
                fontSize={{
                  xs: "1.25rem",
                  sm: "1.75rem",
                }}
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
              <NavLink to="/">
                <Typography
                  variant="h3"
                  color="white"
                  fontSize={{
                    xs: "1.25rem",
                    sm: "1.75rem",
                  }}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  교내 지도
                </Typography>
              </NavLink>

              <NavLink to="/about">
                <Typography
                  variant="h3"
                  color="white"
                  fontSize={{
                    xs: "1.25rem",
                    sm: "1.75rem",
                  }}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  소개
                </Typography>
              </NavLink>

              {/* 건물 상세 버튼 */}
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  cursor: "pointer",
                }}
                onClick={handleToggleAccordion}
              >
                <Typography
                  variant="h3"
                  color="white"
                  fontSize={{
                    xs: "1.25rem",
                    sm: "1.75rem",
                  }}
                >
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
                    <NavLink key={building.id} to={`detail/${building.alpha}`}>
                      <Grid container spacing={1}>
                        <Grid size={1.5}>
                          <Typography
                            variant="h4"
                            color="white"
                            fontSize={{
                              xs: "1rem",
                              sm: "1.5rem",
                            }}
                          >
                            {building.alpha}
                          </Typography>
                        </Grid>
                        <Grid size={10.5}>
                          <Typography
                            variant="h4"
                            color="white"
                            fontSize={{
                              xs: "1rem",
                              sm: "1.5rem",
                            }}
                            fontWeight={300}
                          >
                            {building.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </NavLink>
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
    </>
  );
};

export default Header;
