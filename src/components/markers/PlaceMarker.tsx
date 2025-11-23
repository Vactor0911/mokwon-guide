import IconMarker from "./IconMarker";
import { getMarkerColor, getMarkerIcon } from "../../utils/marker";

interface PlaceMarkerProps {
  position: number[];
  category: string;
  onClick?: () => void;
}

const PlaceMarker = (props: PlaceMarkerProps) => {
  const { position, category, onClick } = props;

  return (
    <IconMarker
      position={position}
      color={getMarkerColor(category)}
      Icon={getMarkerIcon(category)}
      onClick={onClick ? onClick : () => {}}
    />
  );
};

export default PlaceMarker;
