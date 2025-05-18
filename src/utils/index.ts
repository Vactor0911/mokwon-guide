import { FacilityInterface } from "./search";

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
  if (id.charAt(id.length - 1) === "B") {
    return `B${floor}`;
  }
  return `${floor}F`;
};
