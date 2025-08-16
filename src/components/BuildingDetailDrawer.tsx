import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  SwipeableDrawer,
  Typography,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useAtom, useAtomValue } from "jotai";
import {
  buildingDetailDrawerBuildingAtom,
  isBuildingDetailDrawerOpenAtom,
} from "../states";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const BuildingDetailDrawer = () => {
  const navigate = useNavigate(); // 리다이렉트 네비게이션
  const theme = useTheme();

  const buildingDetailDrawerBuilding = useAtomValue(
    buildingDetailDrawerBuildingAtom
  ); // 건물 상세 드로어에 표시할 건물 정보
  const [isBuildingDetailDrawerOpen, setIsBuildingDetailDrawerOpen] = useAtom(
    isBuildingDetailDrawerOpenAtom
  ); // 건물 상세 드로어 열림 상태

  const [imageSrc, setImageSrc] = useState<string | null>(null); // 이미지 경로
  const [isImageLoaded, setIsImageLoaded] = useState(false); // 이미지 로딩 여부
  const [isImageError, setIsImageError] = useState(false); // 이미지 로딩 실패 여부

  // 이미지 경로 및 상태 초기화
  useEffect(() => {
    // 건물 정보가 없으면 종료
    if (!buildingDetailDrawerBuilding?.id) {
      return;
    }

    const newSrc = `./images/building_images/${buildingDetailDrawerBuilding.id.toLowerCase()}.jpg`;
    setImageSrc(newSrc);
    setIsImageLoaded(false);
    setIsImageError(false);
  }, [buildingDetailDrawerBuilding?.id]);

  // 닫기 버튼 클릭
  const handleCloseButtonClick = useCallback(() => {
    setIsBuildingDetailDrawerOpen(false);
  }, [setIsBuildingDetailDrawerOpen]);

  // 건물 대표 이미지 클릭
  const handleBuildingImageClick = useCallback(() => {
    setIsBuildingDetailDrawerOpen(false);
    navigate(`/detail?building=${buildingDetailDrawerBuilding?.id ?? "A"}`);
  }, [
    buildingDetailDrawerBuilding?.id,
    navigate,
    setIsBuildingDetailDrawerOpen,
  ]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isBuildingDetailDrawerOpen}
      onClose={() => setIsBuildingDetailDrawerOpen(false)}
      onOpen={() => setIsBuildingDetailDrawerOpen(true)}
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
          borderTopLeftRadius: { xs: 8, sm: 16 },
          borderTopRightRadius: { xs: 8, sm: 16 },
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
          {/* 건물명 */}
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="h4">
              {buildingDetailDrawerBuilding?.id}
            </Typography>
            <Typography variant="h5" fontWeight={400}>
              {buildingDetailDrawerBuilding?.name}
            </Typography>
          </Stack>

          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleCloseButtonClick}
            sx={{ padding: "4px", transform: "translateX(8px)" }}
          >
            <CloseRoundedIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
        </Stack>

        {/* 건물 대표 이미지 */}
        <Button
          color="info"
          onClick={handleBuildingImageClick}
          sx={{
            position: "relative",
            padding: 0,
            overflow: "hidden",
            borderRadius: { xs: "8px", sm: "16px" },
          }}
        >
          {/* 로딩된 대표 이미지 */}
          {imageSrc && !isImageError && (
            <Box
              component="img"
              src={imageSrc}
              alt={`${buildingDetailDrawerBuilding?.name} 대표 이미지`}
              width="100%"
              display={isImageLoaded ? "block" : "none"}
              minHeight={200}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => {
                setIsImageLoaded(true);
                setIsImageError(true);
              }}
            />
          )}

          {/* 이미지 로딩 실패 시 대체 메시지 */}
          {isImageError && (
            <Box
              width="100%"
              height={200}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="grey.300"
            >
              <Typography variant="subtitle1" color="textSecondary">
                이미지를 불러올 수 없습니다.
              </Typography>
            </Box>
          )}

          {/* 로딩 중 스켈레톤 */}
          {!isImageLoaded && !isImageError && (
            <Skeleton variant="rectangular" width="100%" height={200} />
          )}

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
        {/* TODO: 추후에 개발할 예정 */}
        <Stack direction="row" justifyContent="flex-end" gap={2}>
          {/* 출발 */}
          {/* <Button
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
          </Button> */}

          {/* 도착 */}
          {/* <Button
            variant="contained"
            color="secondary"
            startIcon={<LocationOnOutlinedIcon />}
            sx={{
              borderRadius: "50px",
            }}
          >
            <Typography variant="h6">도착</Typography>
          </Button> */}
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
};

export default BuildingDetailDrawer;
