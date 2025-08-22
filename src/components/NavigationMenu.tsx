import {
  Autocomplete,
  Box,
  IconButton,
  Slide,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { pathAtom, pointAtom } from "../states";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TripOriginRoundedIcon from "@mui/icons-material/TripOriginRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import BuildingData from "../assets/buildings.json";
import { useCallback, useEffect, useState } from "react";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import ElectricScooterRoundedIcon from "@mui/icons-material/ElectricScooterRounded";
import { findShortestPath } from "../utils/navigate";
import { findNodeByBuildingId } from "../utils";

const NavigationMenu = () => {
  const theme = useTheme();

  const [swapButtonAngle, setSwapButtonAngle] = useState(0);
  const [point, setPoint] = useAtom(pointAtom);
  const options = BuildingData.map(
    (building) => `${building.id} ${building.name}`
  );
  const setPath = useSetAtom(pathAtom);

  // 지점 교체 버튼 클릭
  const handleSwapButtonClick = useCallback(() => {
    // 애니메이션 실행
    setSwapButtonAngle((prev) => prev + 180);

    // 지점 교체
    setPoint((prev) => ({
      origin: prev.destination,
      destination: prev.origin,
    }));
  }, [setPoint]);

  // 닫기 버튼 클릭
  const handleCloseButtonClick = useCallback(() => {
    setPoint({ origin: "", destination: "" });
  }, [setPoint]);

  // 출발지 변경
  const handleOriginChange = useCallback(
    (_event: React.SyntheticEvent, value: string | null) => {
      setPoint((prev) => ({
        ...prev,
        origin: value ?? "",
      }));
    },
    [setPoint]
  );

  // 도착지 변경
  const handleDestinationChange = useCallback(
    (_event: React.SyntheticEvent, value: string | null) => {
      setPoint((prev) => ({
        ...prev,
        destination: value ?? "",
      }));
    },
    [setPoint]
  );

  // 경로 계산
  useEffect(() => {
    // 출발지 혹은 도착지가 비어있다면 종료
    if (!point.origin || !point.destination) {
      setPath(null);
      return;
    }

    // 출발지 및 도착지 정보 추출
    const originXY = findNodeByBuildingId(point.origin.split(" ")[0])?.position;
    const destinationNodeId = findNodeByBuildingId(
      point.destination.split(" ")[0]
    )?.id;

    if (!originXY || !destinationNodeId) {
      setPath(null);
      return;
    }

    // 경로 계산
    const result = findShortestPath(originXY, destinationNodeId);

    if (result) {
      const newPath = {
        path: result.positions,
        distance: result.distance,
      };
      setPath(newPath);
    } else {
      setPath({
        path: [],
        distance: -1,
      });
    }
  }, [point.origin, point.destination, setPath]);

  return (
    <Slide
      in={!!point.origin || !!point.destination}
      direction="down"
      mountOnEnter
      unmountOnExit
    >
      <Stack
        bgcolor="white"
        padding={1}
        borderRadius={4}
        border={`3px solid ${theme.palette.primary.main}`}
      >
        {/* 지점 선택 */}
        <Stack direction="row" alignItems="center" gap={1}>
          {/* 지점 교체 버튼 */}
          <IconButton size="small" onClick={handleSwapButtonClick}>
            <SwapVertRoundedIcon
              fontSize="large"
              sx={{
                transform: `rotate(${swapButtonAngle}deg)`,
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </IconButton>

          {/* 지점 컨테이너 */}
          <Stack gap={0.5} width="100%">
            {/* 출발지 */}
            <Stack direction="row" alignItems="center" gap={1}>
              <TripOriginRoundedIcon color="success" />
              <Autocomplete
                fullWidth
                options={options}
                value={point.origin}
                onChange={handleOriginChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="출발지 선택"
                  />
                )}
                sx={{
                  "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
                    display: "none",
                  },
                }}
              />
            </Stack>

            {/* 구분선 */}
            <Box
              height="2px"
              bgcolor={theme.palette.divider}
              borderRadius="50%"
            />

            {/* 도착지 */}
            <Stack direction="row" alignItems="center" gap={1}>
              <FlagRoundedIcon color="primary" />
              <Autocomplete
                fullWidth
                options={options}
                value={point.destination}
                onChange={handleDestinationChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="도착지 선택"
                  />
                )}
                sx={{
                  "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
                    display: "none",
                  },
                }}
              />
            </Stack>
          </Stack>

          {/* 닫기 버튼 */}
          <IconButton
            size="small"
            sx={{
              alignSelf: "flex-start",
              transform: "translate(4px, -4px)",
            }}
            onClick={handleCloseButtonClick}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        {/* 길찾기 결과 */}
        <Stack
          height={point.origin && point.destination ? "30px" : 0}
          marginTop={point.origin && point.destination ? 1 : 0}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          color="text.secondary"
          gap={2}
          overflow="hidden"
          sx={{
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* 도보 */}
          <Stack direction="row" alignItems="center" gap={0.5}>
            <DirectionsWalkRoundedIcon />
            <Typography variant="subtitle1" fontWeight="bold">
              10분
            </Typography>
          </Stack>

          {/* 전동 킥보드 */}
          <Stack direction="row" alignItems="center" gap={0.5}>
            <ElectricScooterRoundedIcon />
            <Typography variant="subtitle1" fontWeight="bold">
              3분
            </Typography>
          </Stack>

          {/* 이동 거리 */}
          <Typography variant="subtitle1" fontWeight="bold">
            500m
          </Typography>
        </Stack>
      </Stack>
    </Slide>
  );
};

export default NavigationMenu;
