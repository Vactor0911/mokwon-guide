import { ImageOverlay, MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression, CRS } from "leaflet";
import MapImage from "/images/map.png";
import { useMediaQuery } from "@mui/material";
import { theme } from "../theme";

const MapViewer = () => {
  const bounds: LatLngBoundsExpression = useMediaQuery(
    theme.breakpoints.up("sm")
  )
    ? [
        [0, 0],
        [3840, 2160],
      ]
    : [
        [0, 0],
        [1920, 1080],
      ];

  const maxBounds: LatLngBoundsExpression = useMediaQuery(
    theme.breakpoints.up("sm")
  )
    ? [
        [0, 100],
        [3840, 2060],
      ]
    : [
        [0, 50],
        [1920, 930],
      ];

  return (
    <MapContainer
      crs={CRS.Simple}
      bounds={bounds}
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      maxZoom={1.5}
      scrollWheelZoom={true}
      css={{
        height: "100%",
        "& .leaflet-control-container .leaflet-top.leaflet-left": {
          bottom: "22px",
          right: "4px",
          left: "initial",
          top: "initial",
        },
        "& .leaflet-control-attribution > a:first-child, & .leaflet-control-attribution > span":
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
          목원대학교 3D 캠퍼스맵
        </a>'
      />
    </MapContainer>
  );
};

export default MapViewer;
