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
import { useAtom } from "jotai";
import { pointAtom } from "../states";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TripOriginRoundedIcon from "@mui/icons-material/TripOriginRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import BuildingData from "../assets/buildings.json";
import { useCallback, useState } from "react";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import ElectricScooterRoundedIcon from "@mui/icons-material/ElectricScooterRounded";

const NavigationMenu = () => {
  const theme = useTheme();

  const [swapButtonAngle, setSwapButtonAngle] = useState(0);

  const [point, setPoint] = useAtom(pointAtom);
  const options = BuildingData.map(
    (building) => `${building.id} ${building.name}`
  );

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
        gap={1}
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
          height={p}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          color="text.secondary"
          gap={2}
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
