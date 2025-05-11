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
