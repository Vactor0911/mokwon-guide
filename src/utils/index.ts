import { FacilityInterface } from "./search";
import facilities from "../assets/facilities.json"; // 시설 데이터 가져오기

/**
 * 문자열 변형 함수
 * @param text 변형할 문자열
 * @param isStricted 변형 모드 (true: 특수문자 구분, false: 특수문자 구분하지 않음)
 * @returns 변형된 문자열
 */
export const formatString = (
  text: string,
  isStricted: boolean = false
): string => {
  const parsedText = text.trim().toLowerCase();

  if (isStricted) {
    return parsedText;
  }
  return parsedText.replace(/[^a-z0-9가-힣]/g, "");
};

/**
 * 건물 또는 시설에 대한 URL 생성
 * @param item 건물 또는 시설 객체
 * @returns 해당 항목의 상세 페이지 URL
 */
export const getItemUrl = (item: FacilityInterface): string => {
  // 건물인 경우
  if (item.id.length <= 2) {
    return `/detail?building=${item.id}`;
  }

  // 시설인 경우
  const parsedId = item.id.slice(0, 3);
  switch (parsedId) {
    case "G1-":
    case "O1-":
      return `/detail?building=${parsedId.slice(0, 2)}&facility=${item.id}`;
    default:
      return `/detail?building=${parsedId.charAt(0)}&facility=${item.id}`;
  }
};

/**
 * 시설 ID에서 건물 코드를 추출하는 함수
 * @param id 시설 ID
 * @returns 건물 코드
 */
export const getBuildingId = (id: string): string => {
  // 건물 ID에서 건물 코드 추출
  const buildingId = id.slice(0, 3);

  switch (buildingId) {
    case "G1-":
    case "O1-":
      return buildingId.slice(0, 2);
    default:
      return buildingId.charAt(0);
  }
};

/**
 * 시설 ID에서 층수를 추출하는 함수
 * @param id 시설 ID
 * @returns 시설이 위치한 층수
 */
export const getFacilityFloor = (id: string): string => {
  const buildingId = getBuildingId(id);
  let floor = "";

  switch (buildingId) {
    case "G1":
    case "O1":
      floor = id.slice(3, 4);
      break;
    default:
      floor = id.slice(1, 2);
      break;
  }

  // 마지막 글자가 'B'인 경우
  if (
    id.charAt(id.length - 1) === "B" ||
    id.split("B").length - Number(id.charAt(0) === "B") - 1 > 0
  ) {
    return `B${floor}`;
  }
  return `${floor}F`;
};

/**
 * 모든 건물의 층수를 반환하는 함수
 * @returns 건물별 층수 배열
 */
export const getBuildingFloors = (): Record<string, string[]> => {
  const floors: Record<string, string[]> = {};

  facilities.forEach((facility) => {
    const buildingId = getBuildingId(facility.id);

    // 기존 건물 ID 키가 없는 경우
    if (!(buildingId in floors)) {
      floors[buildingId] = [];
    }

    const floor = getFacilityFloor(facility.id);
    if (!floors[buildingId].includes(floor)) {
      floors[buildingId].push(floor);
    }
  });

  return floors;
};

/**
 * 위도와 경도를 지도 이미지의 좌표로 변환하는 함수
 * @param lat 위도값
 * @param lng 경도값
 * @returns 변환된 좌표값
 */
export const geoToXY = (lat: number, lng: number): [number, number] => {
  const ROTATION_ANGLE_DEGREES = 277; // 회전 각도 (도 단위)
  const BASE_LATITUDE = 36.327222; // 기준점 위도
  const BASE_LONGITUDE = 127.338333; // 기준점 경도
  const SCALE_FACTOR = 340000; // 좌표 스케일링 팩터
  const OFFSET_X = 1059; // X축 offset
  const OFFSET_Y = 1000; // Y축 offset

  // 각도를 라디안으로 변환
  const angleRad = ROTATION_ANGLE_DEGREES * (Math.PI / 180); 

  // p1에서 p2를 기준으로 평행이동
  const dx = lat - BASE_LATITUDE;
  const dy = lng - BASE_LONGITUDE;

  // 위도와 경도 좌표를 기준점을 기준으로 회전
  const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
  const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

  // 실제 지도와 일치하도록 좌표 보정
  const finalX = -rotatedX * SCALE_FACTOR + OFFSET_X;
  const finalY = rotatedY * SCALE_FACTOR + OFFSET_Y;

  // 최종 좌표 보정
  const multiplier = 0.25; // 화면 크기에 따라 조정할 배율

  return [finalY * multiplier, finalX * multiplier];
};

// 건물 배치도 이미지 URL을 반환하는 함수
export const getBuildingLayoutImageUrl = (
  buildingId: string,
  floor: string
) => {
  // 건물 ID 및 층수 형식 변환
  const formattedBuildingId = buildingId.toLowerCase();
  let formattedFloor = floor.replace("F", "").toLowerCase();

  // 특정 건물의 경우 층수 조정
  if (buildingId === "T" && formattedFloor === "3") {
    formattedFloor = "2";
  }

  // 이미지 URL 생성
  const imageUrl = `./images/building_layouts/${formattedBuildingId}_${formattedFloor}.jpg`;
  return imageUrl;
};
