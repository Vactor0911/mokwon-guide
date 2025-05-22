import { ImageOverlay, MapContainer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression, CRS } from "leaflet";
import MapImage from "/images/map.png";
import { Button, useMediaQuery } from "@mui/material";
import { theme } from "../theme";
import { useCallback, useState } from "react";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import { geoToXY } from "../utils";

const MapViewer = () => {
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const bounds: LatLngBoundsExpression = isLargeScreen
    ? [
        [0, 0],
        [1920, 1080],
      ]
    : [
        [0, 0],
        [960, 540],
      ];

  const maxBounds: LatLngBoundsExpression = isLargeScreen
    ? [
        [0, -500],
        [1920, 1580],
      ]
    : [
        [0, 0],
        [960, 540],
      ];

  // 내 위치 버튼 클릭
  const [map, setMap] = useState<L.Map | null>(null);
  const handleMyLocationClick = useCallback(() => {
    const center: [number, number] = [500, 500];
    const zoom = 0;

    map?.setView(center, zoom);
  }, [map]);

  const position = [36.329444, 127.339167];

  return (
    <MapContainer
      crs={CRS.Simple}
      bounds={bounds}
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      maxZoom={2.5}
      scrollWheelZoom={true}
      ref={setMap}
      css={{
        height: "100%",
        background: "#fff",
        "& .leaflet-control-container .leaflet-top.leaflet-left": {
          bottom: "22px",
          right: "6px",
          left: "initial",
          top: "initial",
        },
        "& .leaflet-control-attribution > a:first-of-type, & .leaflet-control-attribution > span":
          {
            display: "none",
          },
      }}
    >
      <ImageOverlay
        url={MapImage}
        bounds={bounds}
        attribution='<a href="https://www.mokwon.ac.kr/view/html/sub05/0501.html" style="display: flex; align-items: center; gap: 4px;">
          <img src="/logo.png" alt="logo" height="14px" />
          목원대학교 목원뷰
        </a>'
      />

      <Marker position={geoToXY(position[0], position[1], isLargeScreen)}>
        <Popup>
          {geoToXY(position[0], position[1], isLargeScreen).join(", ")}
        </Popup>
      </Marker>

      {/* 내 위치 버튼 */}
      <Button
        variant="contained"
        color="secondary"
        sx={{
          padding: "8px",
          minWidth: "0",
          borderRadius: "50%",
          color: "white",
          position: "absolute",
          bottom: "90px",
          right: "5px",
          zIndex: 1000,
        }}
        onClick={handleMyLocationClick}
      >
        <MyLocationRoundedIcon />
      </Button>
    </MapContainer>
  );
};

export default MapViewer;
