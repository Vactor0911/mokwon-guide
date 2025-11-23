import { useCallback } from "react";
import IconMarker from "./IconMarker";
import { getMarkerColor, getMarkerIcon } from "../../utils/marker";

interface PlaceMarkerProps {
  position: number[];
  category: string;
}

const PlaceMarker = (props: PlaceMarkerProps) => {
  const { position, category } = props;

  // 건물 마커 클릭
  const handleMarkerClick = useCallback(() => {
    // TODO: 장소 마커 클릭 시 동작 구현
  }, []);

  return (
    <IconMarker
      position={position}
      color={getMarkerColor(category)}
      Icon={getMarkerIcon(category)}
      onClick={handleMarkerClick}
    />
  );
};

export default PlaceMarker;
