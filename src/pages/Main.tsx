import { Stack } from "@mui/material";
import BuildingDetailDrawer from "../components/BuildingDetailDrawer";
import MapViewer from "../components/MapViewer";
import { useSetAtom } from "jotai";
import { selectedFacilityAtom } from "../states";
import { useEffect } from "react";

const Main = () => {
  const setSelectedFacility = useSetAtom(selectedFacilityAtom); // 선택된 시설 상태

  // 선택된 시설 초기화
  useEffect(() => {
    setSelectedFacility(null); 
  }, [setSelectedFacility]);

  return (
    <>
      {/* 지도 뷰어 */}
      <Stack height="calc(calc(var(--vh, 1vh) * 100) - 64px)">
        <MapViewer />
      </Stack>

      {/* 건물 상세 정보 드로어 */}
      <BuildingDetailDrawer />
    </>
  );
};

export default Main;
