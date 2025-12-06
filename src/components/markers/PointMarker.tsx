import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  buildingDetailDrawerBuildingAtom,
  isBuildingDetailDrawerOpenAtom,
  pointAtom,
} from "../../states";
import IconMarker from "./IconMarker";

interface PointMarkerProps {
  position: number[];
  type: "origin" | "destination";
}

const PointMarker = (props: PointMarkerProps) => {
  const { position, type } = props;

  const point = useAtomValue(pointAtom);
  const setBuildingDetailDrawerBuilding = useSetAtom(
    buildingDetailDrawerBuildingAtom
  );
  const setIsBuildingDetailDrawerOpen = useSetAtom(
    isBuildingDetailDrawerOpenAtom
  );

  // 건물 마커 클릭
  const handleMarkerClick = useCallback(() => {
    let buildingData;
    if (type === "origin") {
      if (!point.origin || point.origin === "현위치") {
        return;
      }

      // 건물 상세 대화상자 열기
      const origin = point.origin.split(" ");
      buildingData = {
        id: origin[0],
        name: origin.slice(1).join(" "),
      };
    } else {
      if (!point.destination || point.destination === "현위치") {
        return;
      }

      // 건물 상세 대화상자 열기
      const destination = point.destination.split(" ");
      buildingData = {
        id: destination[0],
        name: destination.slice(1).join(" "),
      };
    }

    if (buildingData) {
      setBuildingDetailDrawerBuilding(buildingData);
      setIsBuildingDetailDrawerOpen(true);
    }
  }, [
    point.destination,
    point.origin,
    setBuildingDetailDrawerBuilding,
    setIsBuildingDetailDrawerOpen,
    type,
  ]);

  return (
    <IconMarker
      position={position}
      color={type === "origin" ? "#4EA60E" : "#1976d2"}
      Icon={type === "origin" ? PlayArrowRoundedIcon : FlagRoundedIcon}
      onClick={handleMarkerClick}
    />
  );
};

export default PointMarker;
