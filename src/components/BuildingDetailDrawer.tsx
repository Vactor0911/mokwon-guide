import {
  Box,
  Button,
  IconButton,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { theme } from "../theme";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

interface BuildingDetailDrawerProps {
  isDrawerOpen: boolean;
  handleDrawerOpen: (newIsDrawerOpen: boolean) => () => void;
}

const BuildingDetailDrawer = (props: BuildingDetailDrawerProps) => {
  const { isDrawerOpen, handleDrawerOpen } = props;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={handleDrawerOpen(false)}
      onOpen={handleDrawerOpen(true)}
      swipeAreaWidth={56}
      disableSwipeToOpen
      sx={{
        "& > .MuiPaper-root": {
          alignItems: "center",
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Stack
        width="100vw"
        maxWidth="600px"
        padding="8px 32px"
        paddingBottom="16px"
        gap={1}
        sx={{
          background: theme.palette.primary.main,
          borderTopLeftRadius: {
            xs: 8,
            sm: 16,
          },
          borderTopRightRadius: {
            xs: 8,
            sm: 16,
          },
          ".MuiButtonBase-root .MuiButton-startIcon > svg": {
            fontSize: "1.75em",
          },
        }}
      >
        {/* 상단 메뉴바 */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          color="white"
        >
          {/* 건물 명칭 */}
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="h4">N</Typography>
            <Typography variant="h5" fontWeight={400}>
              학생회관
            </Typography>
          </Stack>

          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleDrawerOpen(false)}
            sx={{
              padding: "4px",
              transform: "translateX(8px)",
            }}
          >
            <CloseRoundedIcon
              fontSize="large"
              sx={{
                color: "white",
              }}
            />
          </IconButton>
        </Stack>

        {/* 건물 대표 이미지 */}
        <Button
          color="info"
          sx={{
            position: "relative",
            padding: 0,
            overflow: "hidden",
            borderRadius: {
              xs: "8px",
              sm: "16px",
            },
          }}
        >
          {/* 이미지 */}
          <Box
            component="img"
            src="/images/building_images/n_1.jpg"
            alt=""
            width="100%"
          />

          {/* 더보기 라벨 */}
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            padding="6px 10px"
            color="white"
            sx={{
              background: theme.palette.secondary.main,
              position: "absolute",
              bottom: 8,
              left: 8,
              borderRadius: "50px",
            }}
          >
            <SearchRoundedIcon />
            <Typography variant="h6">더보기</Typography>
          </Stack>
        </Button>

        {/* 네비게이션 버튼 */}
        <Stack direction="row" justifyContent="flex-end" gap={2}>
          {/* 출발 */}
          <Button
            variant="contained"
            color="info"
            startIcon={<RadioButtonCheckedRoundedIcon color="secondary" />}
            sx={{
              borderRadius: "50px",
            }}
          >
            <Typography variant="h6" color="secondary">
              출발
            </Typography>
          </Button>

          {/* 도착 */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LocationOnOutlinedIcon />}
            sx={{
              borderRadius: "50px",
            }}
          >
            <Typography variant="h6">도착</Typography>
          </Button>
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
};

export default BuildingDetailDrawer;
