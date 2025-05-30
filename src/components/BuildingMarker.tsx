import { LatLngExpression } from "leaflet";
import { useCallback } from "react";
import { useSetAtom } from "jotai";
import {
  buildingDetailDrawerBuildingAtom,
  isBuildingDetailDrawerOpenAtom,
} from "../states";
import { searchById } from "../utils/search";
import CircularMarker from "./CircularMarker";

interface BuildingMarkerProps {
  buildingId: string;
  position: LatLngExpression;
}

const BuildingMarker = (props: BuildingMarkerProps) => {
  const { buildingId, position } = props;

  const setIsBuildingDetailDrawerOpen = useSetAtom(
    isBuildingDetailDrawerOpenAtom
  ); // 건물 상세 드로어 열림 상태
  const setBuildingDetailDrawerBuilding = useSetAtom(
    buildingDetailDrawerBuildingAtom
  ); // 건물 상세 드로어에 표시할 건물 정보

  // 건물 마커 클릭
  const handleMarkerClick = useCallback(() => {
    const buildingData = {
      id: buildingId,
      name: searchById(buildingId)?.name || "",
    };
    setBuildingDetailDrawerBuilding(buildingData);
    setIsBuildingDetailDrawerOpen(true);
  }, [
    buildingId,
    setBuildingDetailDrawerBuilding,
    setIsBuildingDetailDrawerOpen,
  ]);

  return (
    <CircularMarker
      title={buildingId}
      position={position}
      onClick={handleMarkerClick}
    />
  );
};

export default BuildingMarker;
