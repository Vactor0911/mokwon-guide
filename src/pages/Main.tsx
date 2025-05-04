import { Box, Button, Stack } from "@mui/material";
import BuildingDetailDrawer from "../components/BuildingDetailDrawer";
import { useCallback, useState } from "react";

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
        Hello World!

        <Box>
          <Button
            variant="contained"
            onClick={handleBuildingDetailDrawerOpen(true)}
          >
            건물 상세 드로어 메뉴 열기
          </Button>
        </Box>
      </Stack>
      <BuildingDetailDrawer
        isDrawerOpen={isBuildingDetailDrawerOpen}
        handleDrawerOpen={handleBuildingDetailDrawerOpen}
      />
    </>
  );
};

export default Main;
