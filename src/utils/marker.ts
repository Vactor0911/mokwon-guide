import LocalCafeRoundedIcon from "@mui/icons-material/LocalCafeRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";

/**
 * 카테고리에 따른 마커 색상 반환
 * @param category 카테고리
 * @returns 마커 색상
 */
export const getMarkerColor = (category: string) => {
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
};

/**
 * 카테고리에 따른 마커 아이콘 반환
 * @param category 카테고리
 * @returns 마커 아이콘
 */
export const getMarkerIcon = (category: string) => {
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
};
