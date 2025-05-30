import { Color } from "@mui/material";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useCallback } from "react";
import { Marker } from "react-leaflet";
import { theme } from "../theme";

interface CircularMarkerProps {
  title?: string;
  color?: Color | string;
  position: LatLngExpression;
  onClick?: () => void;
}

const CircularMarker = (props: CircularMarkerProps) => {
  const {
    title = "",
    color = theme.palette.primary.main,
    position,
    onClick,
  } = props;

  // 위치 조정 함수
  const calcPosition = useCallback(
    (position: LatLngExpression): LatLngExpression => {
      const newPosition = position as [number, number];
      const lat = newPosition[0]; // 위도 조정
      const lng = newPosition[1]; // 경도 조정
      return [lat, lng];
    },
    []
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
                        background-color: ${color}; border-radius: 50%; border: 2px solid white">
                            <h3 style="font-family: Noto Sans KR, sans-serif; font-weight: 700; color: white">${title}</h3>
                        </div>`,
      })}
      eventHandlers={{
        click: onClick || (() => {}),
      }}
    />
  );
};

export default CircularMarker;
