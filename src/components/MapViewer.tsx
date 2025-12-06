import {
  ImageOverlay,
  LayerGroup,
  MapContainer,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { CRS, LatLngBounds, LatLngExpression } from "leaflet";
import MapImage from "/images/map.png";
import {
  Alert,
  Button,
  Snackbar,
  SnackbarCloseReason,
  Zoom,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import GpsOffRoundedIcon from "@mui/icons-material/GpsOffRounded";
import LocationSearchingRoundedIcon from "@mui/icons-material/LocationSearchingRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import { findNodeByBuildingId, geoToXY } from "../utils";
import buildings from "../assets/buildings.json";
import places from "../assets/places.json";
import BuildingMarker from "./BuildingMarker";
import CircularMarker from "./CircularMarker";
import { useEffect } from "react";
import PointMarker from "./markers/PointMarker";
import { useAtom, useAtomValue } from "jotai";
import {
  geoLocationAtom,
  isNavigationMenuOpenAtom,
  pathAtom,
  pointAtom,
  selectedCategoriesAtom,
} from "../states";
import NavigationIcon from "@mui/icons-material/Navigation";
import PlaceMarker from "./markers/PlaceMarker";
import MarkerSelector from "./MarkerSelector";
import { useNavigate } from "react-router";

const MapViewer = () => {
  // 지도 범위 설정
  const bounds: LatLngBounds = L.latLngBounds([
    [0, 0],
    [960, 540],
  ]);

  // 지도 최대 범위 설정
  const maxBounds: LatLngBounds = L.latLngBounds([
    [-100, -25],
    [960, 565],
  ]);

  const map = useRef<L.Map | null>(null); // 지도 객체
  const [zoom, setZoom] = useState(0); // 지도 줌 레벨
  const zoomRef = useRef(zoom); // 줌 레벨 참조
  const [isLocationTracking, setIsLocationTracking] = useState(true); // 실시간 위치 추적 상태
  const [isLocationFollowing, setIsLocationFollowing] = useState(false); // 실시간 위치 따라오기 상태
  const isLocationFollowingRef = useRef(isLocationFollowing);
  const watchIdRef = useRef<number | null>(null); // 위치 추적 ID
  const [geoLocation, setGeoLocation] = useAtom(geoLocationAtom); // 내 위치 좌표
  const [isAlertOpen, setIsAlertOpen] = useState(false); // 경고창 열림 상태
  const [alertMessage, setAlertMessage] = useState(""); // 경고창 메시지
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useAtom(
    isNavigationMenuOpenAtom
  );
  const point = useAtomValue(pointAtom);
  const path = useAtomValue(pathAtom);

  // 선택된 카테고리
  const navigate = useNavigate();
  const selectedCategories = useAtomValue(selectedCategoriesAtom);

  // 지도 이벤트 리스너
  const MapEventListener = () => {
    const map = useMap(); // 지도 객체

    useMapEvents({
      zoom: (e) => {
        // 줌 레벨 변경 시 상태 업데이트
        setZoom(e.target.getZoom());
        zoomRef.current = e.target.getZoom();
      },
      zoomend: (e) => {
        // 줌 레벨 업데이트 & 위치 따라가기
        const currentZoom = e.target.getZoom();
        setZoom(currentZoom);
        zoomRef.current = currentZoom;
        if (isLocationFollowing && geoLocation) {
          map.setView(geoLocation as [number, number], currentZoom, {
            animate: true,
          });
        }
      },
      dragstart: () => {
        // 드래그 시 위치 따라가기 중지
        if (isLocationFollowing) {
          setIsLocationFollowing(false);
          isLocationFollowingRef.current = false;
        }
      },
    });
    return null;
  };

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
    if (!navigator.geolocation) {
      handleAlertOpen("위치 정보를 가져올 수 없습니다.");
      setIsLocationTracking(false);
      setIsLocationFollowing(false);
      setGeoLocation(null);
      return;
    }

    // 추적 중이면 중복 등록 방지
    if (watchIdRef.current !== null) {
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newGeoLocation = geoToXY(latitude, longitude);

        // 위치 갱신 및 지도 이동
        setGeoLocation(newGeoLocation);
        setIsLocationTracking(true);

        if (isLocationFollowingRef.current && map.current) {
          map.current.setView(newGeoLocation, zoomRef.current, {
            animate: true,
          });
        }
      },
      // 위치 정보 가져오기 실패
      () => {
        handleAlertOpen("위치 정보를 가져올 수 없습니다.");
        setIsLocationTracking(false);
        setIsLocationFollowing(false);
        setGeoLocation(null);
        watchIdRef.current = null;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    watchIdRef.current = id;
  }, [handleAlertOpen, setGeoLocation]);

  // 위치 추적 중지
  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsLocationTracking(false);
    setIsLocationFollowing(false);
    setGeoLocation(null);
  }, [setGeoLocation]);

  // 내 위치 따라가기 버튼 클릭
  const handleMyLocationClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      // 위치 추적이 비활성화 상태면 위치 정보 업데이트
      if (!isLocationTracking) {
        updateCurrentLocation();
        return;
      }

      const newIsLocationFollowing = !isLocationFollowing;
      setIsLocationFollowing(newIsLocationFollowing);
      isLocationFollowingRef.current = newIsLocationFollowing;

      // 내 위치 따라가기를 켤 때 지도 이동
      if (newIsLocationFollowing) {
        map.current?.setView(geoLocation as [number, number], zoom, {
          animate: true,
        });
      }
    },
    [
      geoLocation,
      isLocationFollowing,
      isLocationTracking,
      updateCurrentLocation,
      zoom,
    ]
  );

  // 컴포넌트 언마운트 시 위치 추적 중지
  useEffect(() => {
    updateCurrentLocation();

    return () => {
      stopLocationTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 길찾기 메뉴 버튼 클릭
  const handleNavigationButtonClick = useCallback(() => {
    setIsNavigationMenuOpen(true);
  }, [setIsNavigationMenuOpen]);

  return (
    <MapContainer
      crs={CRS.Simple}
      bounds={bounds}
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      zoom={zoom}
      maxZoom={1.7}
      scrollWheelZoom={true}
      ref={map}
      css={{
        height: "100%",
        background: "transparent",
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
      {/* 지도 이미지 오버레이 */}
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

        {/* 시설물 마커 */}
        {places
          .filter((place) => {
            return selectedCategories.some(
              (categoryObj) =>
                categoryObj.category === place.category && categoryObj.selected
            );
          })
          .map((place) => {
            return (
              <PlaceMarker
                key={place.id}
                position={[place.position[0] * 0.5, place.position[1] * 0.5]}
                category={place.category}
                onClick={() =>
                  navigate(
                    `/detail?building=${place.buildingId}&facility=${place.facilityId}`
                  )
                }
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

      {/* 경로 이미지 오버레이 */}
      <LayerGroup>
        <Polyline
          pathOptions={{ color: "#1976d2", weight: 6 * (zoom + 1) }}
          positions={(path?.path as LatLngExpression[]) || []}
        />

        <Polyline
          pathOptions={{ color: "white", weight: 2 * (zoom + 1) }}
          positions={(path?.path as LatLngExpression[]) || []}
        />

        {/* 출발지 마커 */}
        {point.origin && (
          <PointMarker
            position={
              point.origin === "현위치"
                ? (geoLocation as number[])
                : findNodeByBuildingId(point.origin.split(" ")[0])?.position ||
                  []
            }
            type="origin"
          />
        )}

        {/* 도착지 마커 */}
        {point.destination && (
          <PointMarker
            position={
              point.destination === "현위치"
                ? (geoLocation as number[])
                : findNodeByBuildingId(point.destination.split(" ")[0])
                    ?.position || []
            }
            type="destination"
          />
        )}
      </LayerGroup>

      {/* 지도 이벤트 리스너 */}
      <MapEventListener />

      {/* 길찾기 메뉴 버튼 */}
      <Zoom in={!isNavigationMenuOpen}>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            padding: "8px",
            minWidth: "0",
            borderRadius: "50%",
            color: "white",
            position: "absolute",
            top: {
              xs: "75px",
              sm: "20px",
            },
            right: "20px",
            zIndex: 1002,
          }}
          onClick={handleNavigationButtonClick}
        >
          <NavigationIcon />
        </Button>
      </Zoom>

      {/* 내 위치 따라가기 버튼 */}
      <Button
        variant="contained"
        color="secondary"
        loading={isLocationTracking && !geoLocation}
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
          isLocationFollowing ? (
            <MyLocationRoundedIcon />
          ) : (
            <LocationSearchingRoundedIcon />
          )
        ) : (
          <GpsOffRoundedIcon />
        )}
      </Button>

      {/* 시설물 마커 선택기 */}
      <MarkerSelector
        position="absolute"
        top={20}
        zIndex={1000}
        className="leaflet-control"
      />

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
