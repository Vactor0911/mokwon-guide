import { ImageOverlay, MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression, CRS } from "leaflet";
import MapImage from "/images/map.png";
import { Alert, Button, Snackbar, SnackbarCloseReason } from "@mui/material";
import { useCallback, useState } from "react";
import LocationSearchingRoundedIcon from "@mui/icons-material/LocationSearchingRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import { geoToXY } from "../utils";
import buildings from "../assets/buildings.json";
import BuildingMarker from "./BuildingMarker";
import CircularMarker from "./CircularMarker";
import { useEffect } from "react";

const MapViewer = () => {
  // 지도 범위 설정
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [960, 540],
  ];

  // 지도 최대 범위 설정
  const maxBounds: LatLngBoundsExpression = [
    [-100, -25],
    [960, 565],
  ];

  const [map, setMap] = useState<L.Map | null>(null); // 지도 객체
  const [isLocationTracking, setIsLocationTracking] = useState(false); // 실시간 위치 추적 상태
  const [geoLocation, setGeoLocation] = useState<number[] | null>(null); // 내 위치 좌표
  const [isAlertOpen, setIsAlertOpen] = useState(false); // 경고창 열림 상태
  const [alertMessage, setAlertMessage] = useState(""); // 경고창 메시지

  // 경고창 열기
  const handleAlertOpen = useCallback((newAlertMessage: string) => {
    setAlertMessage(newAlertMessage);
    setIsAlertOpen(true);
  }, []);

  // 경고창 닫기
  const handleAlertClose = useCallback(
    (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === "clickaway") {
        return;
      }

      setIsAlertOpen(false);
    },
    []
  );

  // 현재 위치 정보 업데이트
  const updateCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newGeoLocation = geoToXY(latitude, longitude);

        // 지도 범위 내에 있는지 확인
        const isInBounds = map?.getBounds().contains(newGeoLocation);

        // 현재 위치가 지도 범위 밖임
        if (!isInBounds) {
          handleAlertOpen("내 위치가 지도 범위를 벗어났습니다.");
          setIsLocationTracking(false);
          return;
        }

        // leaflet 지도에서 내 위치 마커로 이동
        const zoom = 0;
        map?.setView(newGeoLocation, zoom);
        setGeoLocation(newGeoLocation);
        setIsLocationTracking(true);
      },
      // 위치 정보 가져올 수 없음
      () => {
        handleAlertOpen(`위치 정보를 가져올 수 없습니다.`);
        setIsLocationTracking(false);
        return;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [handleAlertOpen, map]);

  // 내 위치 버튼 클릭
  const handleMyLocationClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      // 실시간 위치 추적 중이면 위치 추적 중지
      if (isLocationTracking) {
        setIsLocationTracking(false);
        setGeoLocation(null);
        return;
      }

      // 위치 정보 가져올 수 없음
      if (!navigator.geolocation) {
        handleAlertOpen(`위치 정보를 가져올 수 없습니다.`);
        return;
      }

      // 위치 추적 시도
      updateCurrentLocation();
    },
    [handleAlertOpen, isLocationTracking, updateCurrentLocation]
  );

  useEffect(() => {
    // 실시간 위치 추적중이 아니면 종료
    if (!isLocationTracking) {
      return;
    }

    // 1초마다 현재 위치 업데이트
    const interval = setInterval(() => {
      updateCurrentLocation();
    }, 1000);

    // 클리너
    return () => clearInterval(interval);
  }, [isLocationTracking, updateCurrentLocation]);

  return (
    <MapContainer
      crs={CRS.Simple}
      bounds={bounds}
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      maxZoom={1.7}
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
          <img src="./logo.png" alt="logo" height="14px" />
          목원대학교 목원뷰
        </a>'
      >
        {/* 건물 마커 */}
        {buildings.map((building) => {
          return (
            <BuildingMarker
              key={building.id}
              buildingId={building.id}
              position={[
                building.marker_position[0] * 0.5,
                building.marker_position[1] * 0.5,
              ]}
            />
          );
        })}

        {/* 내 위치 마커 */}
        {geoLocation && (
          <CircularMarker
            position={[geoLocation[0], geoLocation[1]]}
            color="#1976d2"
          />
        )}
      </ImageOverlay>

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
        {isLocationTracking ? (
          <MyLocationRoundedIcon />
        ) : (
          <LocationSearchingRoundedIcon />
        )}
      </Button>

      {/* 경고창 */}
      <Snackbar
        open={isAlertOpen}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </MapContainer>
  );
};

export default MapViewer;
