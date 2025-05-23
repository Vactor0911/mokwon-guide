import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { theme } from "../theme";
import { useCallback } from "react";

interface BuildingMarkerProps {
  buildingId: string;
  position: LatLngExpression;
  isLargeScreen: boolean;
}

const BuildingMarker = (props: BuildingMarkerProps) => {
  const { buildingId, position, isLargeScreen } = props;

  const calcPosition = useCallback(
    (position: LatLngExpression): LatLngExpression => {
      if (isLargeScreen) {
        return position;
      }

      const newPosition = position as [number, number];
      const lat = newPosition[0] * 0.5; // 위도 조정
      const lng = newPosition[1] * 0.5; // 경도 조정
      return [lat, lng];
    },
    [isLargeScreen]
  );

  return (
    <Marker
      position={calcPosition(position)}
      icon={L.divIcon({
        className: "custom-icon",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, 0],
        html: `<div style="width: 26px; height: 26px; display: flex; justify-content: center; align-items: center;
                background-color: ${theme.palette.primary.main}; border-radius: 50%; border: 2px solid white">
                    <h3 style="font-family: Noto Sans KR, sans-serif; font-weight: 700; color: white">${buildingId}</h3>
                </div>`,
      })}
    ></Marker>
  );
};

export default BuildingMarker;
