import { Stack } from "@mui/material";
import BuildingDetailDrawer from "../components/BuildingDetailDrawer";
import { useCallback } from "react";
import MapViewer from "../components/MapViewer";
import { useAtom } from "jotai";
import { isBuildingDetailDrawerOpenAtom } from "../states";

const Main = () => {
  const [isBuildingDetailDrawerOpen, setIsBuildingDetailDrawerOpen] = useAtom(
    isBuildingDetailDrawerOpenAtom
  );

  const handleBuildingDetailDrawerOpen = useCallback(
    (newIsBuildingDetailDrawerOpen: boolean) => () => {
      setIsBuildingDetailDrawerOpen(newIsBuildingDetailDrawerOpen);
    },
    [setIsBuildingDetailDrawerOpen]
  );

  return (
    <>
      <Stack height="calc(100vh - 64px)">
        <MapViewer />
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
