import { Box, Stack } from "@mui/material";
import BuildingDetailDrawer from "../components/BuildingDetailDrawer";
import MapViewer from "../components/MapViewer";
import { useSetAtom } from "jotai";
import { selectedFacilityAtom } from "../states";
import { useEffect } from "react";
import NavigationMenu from "../components/NavigationMenu";

const Main = () => {
  const setSelectedFacility = useSetAtom(selectedFacilityAtom); // 선택된 시설 상태

  // 선택된 시설 초기화
  useEffect(() => {
    setSelectedFacility(null);
  }, [setSelectedFacility]);

  return (
    <>
      {/* 지도 뷰어 */}
      <Stack
        height="calc(calc(var(--vh, 1vh) * 100) - 64px)"
        position="relative"
      >
        {/* 지도 뷰어 */}
        <MapViewer />

        {/* 네비게이션 메뉴 */}
        <Box
          width="90vw"
          maxWidth="350px"
          position="absolute"
          margin={{
            xs: "0 auto",
            sm: "0",
          }}
          top={16}
          left={{
            xs: 0,
            sm: "auto",
          }}
          right={{
            xs: 0,
            sm: 16,
          }}
          zIndex={1000}
        >
          <NavigationMenu />
        </Box>
      </Stack>

      {/* 건물 상세 정보 드로어 */}
      <BuildingDetailDrawer />
    </>
  );
};

export default Main;
