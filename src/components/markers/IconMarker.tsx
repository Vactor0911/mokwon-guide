import { Marker } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface IconMarkerProps {
  position: number[];
  color: string;
  Icon: OverridableComponent<SvgIconTypeMap<object, "svg">>;
  onClick: () => void;
}

const IconMarker = (props: IconMarkerProps) => {
  const { position, color, Icon, onClick } = props;

  // 아이콘 svg
  const iconSvg = useMemo(() => {
    return ReactDOMServer.renderToStaticMarkup(
      <Icon style={{ width: 16, height: 16, color: "white" }} />
    );
  }, [Icon]);

  return (
    <Marker
      position={[position[0], position[1]]}
      icon={L.divIcon({
        className: "custom-icon",
        iconSize: [26, 26],
        iconAnchor: [13, 38],
        html: `
          <div style="
            width: 26px;
            height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${color};
            border-radius: 50%;
            border: 2px solid white;
            position: relative;
          ">
            ${iconSvg}

            <div style="
              position: absolute;
              bottom: -55%;
              left: 50%;
              width: 0;
              height: 0;
              border: 12px solid transparent;
              border-top: 18px solid white;
              border-bottom: 0;
              transform: translateX(-50%);
              z-index: -1;
            " />
          </div>`,
      })}
      eventHandlers={{ click: onClick }}
    />
  );
};

export default IconMarker;
