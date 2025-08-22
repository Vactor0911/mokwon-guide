import facilities from "../assets/facilities.json"; // 시설 데이터
import nodes from "../assets/nodes.json"; // 노드 데이터

/**
 * 시설물 데이터 인터페이스
 */
export interface FacilityInterface {
  id: string;
  name: string;
  marker_position?: number[];
  buildingId?: string;
  floor?: string;
  path?: number[][];
}

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
 * 모든 건물의 층수를 반환하는 함수
 * @returns 건물별 층수 배열
 */
export const getBuildingFloors = (): Record<string, string[]> => {
  const floors: Record<string, string[]> = {};

  facilities.forEach((facility) => {
    // 기존 건물 ID 키가 없는 경우
    if (!(facility.buildingId in floors)) {
      floors[facility.buildingId] = [];
    }

    if (!floors[facility.buildingId].includes(facility.floor)) {
      floors[facility.buildingId].push(facility.floor);
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
  let rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
  let rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

  // 1차 좌표 보정
  if (rotatedX > 0 && rotatedY < 0.0038) {
    rotatedX -= rotatedX * 0.2;
  }
  rotatedY += Math.abs(rotatedY) * 0.04;

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

/**
 * 호실 정보 표의 특정 행이 상단으로 스크롤되도록 이동시키는 함수
 * @param facilityItem 건물 상세 페이지 > 호실 정보 표의 행 요소
 * @returns
 */
export const moveTableItemToTop = (
  facilityItem: HTMLTableRowElement | null
) => {
  // 시설 아이템이 없으면 종료
  if (!facilityItem) {
    return;
  }

  // 부모 테이블 컨테이너 찾기
  const container = facilityItem?.closest(
    ".MuiTableContainer-root"
  ) as HTMLElement;

  // 스크롤 이동
  if (container && facilityItem) {
    const containerRect = container.getBoundingClientRect();
    const itemRect = facilityItem.getBoundingClientRect();
    const currentScrollTop = container.scrollTop;
    const offset = itemRect.top - itemRect.height - containerRect.top;
    const newScrollTop = currentScrollTop + offset;
    container.scrollTo({ top: newScrollTop, behavior: "smooth" });
  }
};

const dictBuildingNode: Record<string, number> = {
  A: 900,
  B: 901,
  C: 902,
  D: 903,
  E: 904,
  F: 905,
  G: 906,
  G1: 907,
  I: 908,
  J: 909,
  K: 910,
  M: 911,
  N: 912,
  O: 913,
  O1: 914,
  P: 915,
  R: 916,
  T: 917,
  U: 918,
  V: 919,
  W: 920,
};

/**
 * 건물 ID에 해당하는 노드를 찾는 함수
 * @param buildingId 건물 ID
 * @returns 건물 ID에 해당하는 노드 객체
 */
export const findNodeByBuildingId = (buildingId: string) => {
  return nodes.find((node) => node.id === dictBuildingNode[buildingId]);
};

/**
 * 노드 ID에 해당하는 노드를 찾는 함수
 * @param nodeId 노드 ID
 * @returns 노드 ID를 가진 노드 객체
 */
export const findNodeById = (nodeId: number) => {
  return nodes.find((node) => node.id === nodeId);
};

/**
 * 이동 시간을 계산하는 함수
 * @param distance 이동 거리 (m)
 * @param kph 시속 (km/h)
 * @returns 이동 시간 (분)
 */
export const calcTravelTime = (distance: number, kph: number) => {
  const minutes = (distance * 18) / (kph * 300);
  return Math.round(minutes);
};
