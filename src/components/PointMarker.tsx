import { Marker } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import { useMemo } from "react";

interface PointMarkerProps {
  position: [number, number];
  type: "origin" | "destination";
}

const PointMarker = (props: PointMarkerProps) => {
  const { position, type } = props;

  const playIconSvg = useMemo(() => {
    return ReactDOMServer.renderToStaticMarkup(
      <PlayArrowRoundedIcon style={{ width: 16, height: 16, color: "white" }} />
    );
  }, []);

  const flagIconSvg = useMemo(() => {
    return ReactDOMServer.renderToStaticMarkup(
      <FlagRoundedIcon style={{ width: 16, height: 16, color: "white" }} />
    );
  }, []);

  return (
    <Marker
      position={position}
      icon={L.divIcon({
        className: "custom-icon",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, 0],
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
          ">
            ${type === "origin" ? playIconSvg : flagIconSvg}
          </div>`,
      })}
    />
  );
};

export default PointMarker;
