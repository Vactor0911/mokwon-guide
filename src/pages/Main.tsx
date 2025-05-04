import { Box, Button, Stack } from "@mui/material";
import BuildingDetailDrawer from "../components/BuildingDetailDrawer";
import { useCallback, useState } from "react";
import MapViewer from "../components/MapViewer";

const Main = () => {
  const [isBuildingDetailDrawerOpen, setIsBuildingDetailDrawerOpen] =
    useState(false);

  const handleBuildingDetailDrawerOpen = useCallback(
    (newIsBuildingDetailDrawerOpen: boolean) => () => {
      setIsBuildingDetailDrawerOpen(newIsBuildingDetailDrawerOpen);
    },
    []
  );

  return (
    <>
      <Stack height="100%">
        <MapViewer />

        {/* 드로어 테스트용 버튼 */}
        <Box position="absolute" bottom={5} left={5}>
          <Button
            variant="contained"
            onClick={handleBuildingDetailDrawerOpen(true)}
          >
            건물 상세 드로어 메뉴 열기
          </Button>
        </Box>
      </Stack>

      {/* 건물 상세 정보 드로어 */}
      <BuildingDetailDrawer
        isDrawerOpen={isBuildingDetailDrawerOpen}
        handleDrawerOpen={handleBuildingDetailDrawerOpen}
      />
    </>
  );
};

export default Main;
