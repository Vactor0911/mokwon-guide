import { Stack } from "@mui/material";
import BuildingDetailDrawer from "../components/BuildingDetailDrawer";
import MapViewer from "../components/MapViewer";

const Main = () => {
  return (
    <>
      <Stack height="calc(100vh - 64px)">
        <MapViewer />
      </Stack>

      {/* 건물 상세 정보 드로어 */}
      <BuildingDetailDrawer />
    </>
  );
};

export default Main;
