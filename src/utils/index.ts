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
export const geoToXY = (
  lat: number,
  lng: number,
  isLargeScreen: boolean
): [number, number] => {
  // 위도와 경도 좌표를 기준점을 기준으로 회전
  const angleRad = 277 * (Math.PI / 180); // 각도를 라디안으로 변환

  // p1에서 p2를 기준으로 평행이동
  const x0 = 36.327222;
  const y0 = 127.338333;
  const dx = lat - x0;
  const dy = lng - y0;

  // 회전 공식 적용
  const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
  const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

  // 다시 기준점 위치로 이동
  const mul = 340000

  const finalX = -rotatedX * mul + 1059;
  const finalY = rotatedY * mul + 1000;

  const multiplier = isLargeScreen ? 0.5 : 0.25; // 지도 크기에 따라 배율 조정, map이 null이면 기본값 1 사용

  return [finalY * multiplier, finalX * multiplier];
};
