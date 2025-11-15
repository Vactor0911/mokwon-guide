import { useCallback, useMemo } from "react";
import IconMarker from "./IconMarker";
import LocalCafeRoundedIcon from "@mui/icons-material/LocalCafeRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";

interface PlaceMarkerProps {
  position: number[];
  category: string;
}

const PlaceMarker = (props: PlaceMarkerProps) => {
  const { position, category } = props;

  // 색상
  const color = useMemo(() => {
    switch (category) {
      case "편의점":
        return "#FFBA01";
      case "카페":
        return "#FE8C52";
      case "식당":
        return "#FE8C52";
      default:
        return "#D971DB";
    }
  }, [category]);

  // 아이콘
  const icon = useMemo(() => {
    switch (category) {
      case "편의점":
        return StorefrontRoundedIcon;
      case "카페":
        return LocalCafeRoundedIcon;
      case "식당":
        return RestaurantRoundedIcon;
      default:
        return StoreRoundedIcon;
    }
  }, [category]);

  // 건물 마커 클릭
  const handleMarkerClick = useCallback(() => {}, []);

  return (
    <IconMarker
      position={position}
      color={color}
      Icon={icon}
      onClick={handleMarkerClick}
    />
  );
};

export default PlaceMarker;
