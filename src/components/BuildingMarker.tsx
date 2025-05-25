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
  );
  const setBuildingDetailDrawerBuilding = useSetAtom(
    buildingDetailDrawerBuildingAtom
  );

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
