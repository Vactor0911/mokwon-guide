import { Marker } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import { useCallback, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  buildingDetailDrawerBuildingAtom,
  isBuildingDetailDrawerOpenAtom,
  pointAtom,
} from "../states";

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

  // 출발지 아이콘 svg
  const playIconSvg = useMemo(() => {
    return ReactDOMServer.renderToStaticMarkup(
      <PlayArrowRoundedIcon style={{ width: 16, height: 16, color: "white" }} />
    );
  }, []);

  // 도착지 아이콘 svg
  const flagIconSvg = useMemo(() => {
    return ReactDOMServer.renderToStaticMarkup(
      <FlagRoundedIcon style={{ width: 16, height: 16, color: "white" }} />
    );
  }, []);

  // 건물 마커 클릭
  const handleMarkerClick = useCallback(() => {
    let buildingData;
    if (type === "origin") {
      if (!point.origin || point.origin === "내 위치") {
        return;
      }

      // 건물 상세 대화상자 열기
      const origin = point.origin.split(" ");
      buildingData = {
        id: origin[0],
        name: origin.slice(1).join(" "),
      };
    } else {
      if (!point.destination) {
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
    point.origin,
    setBuildingDetailDrawerBuilding,
    setIsBuildingDetailDrawerOpen,
    type,
  ]);

  return (
    <Marker
      position={[position[0], position[1]]}
      icon={L.divIcon({
        className: "custom-icon",
        iconSize: [26, 26],
        iconAnchor: [13, 39],
        html: `
          <div style="
            width: 26px;
            height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${type === "origin" ? "#4EA60E" : "#1976d2"};
            border-radius: 50%;
            border: 2px solid white;
            position: relative;
          ">
            ${type === "origin" ? playIconSvg : flagIconSvg}

            <div style="
              position: absolute;
              bottom: -60%;
              left: 50%;
              width: 0;
              height: 0;
              border: 10px solid transparent;
              border-top: 15px solid white;
              border-bottom: 0;
              transform: translateX(-50%);
              z-index: -1;
            " />
          </div>`,
      })}
      eventHandlers={{ click: handleMarkerClick }}
    />
  );
};

export default PointMarker;
