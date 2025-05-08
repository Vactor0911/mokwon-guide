import CryptoJS from "crypto-js";
import buildings from "../assets/buildings.json"; // 건물 데이터 가져오기
import facilities from "../assets/facilities.json"; // 시설 데이터 가져오기

// 환경 변수에서 암호화 키 가져오기
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

/**
 * 검색 결과 인터페이스
 */
export interface SearchResultInterface {
  id: string;
  name: string;
}

/**
 * 문자열 암호화 함수 (AES)
 * @param text 암호화할 문자열
 * @returns AES 암호화된 문자열
 */
export function encrypt(text: string): string {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error("암호화 중 오류 발생", error);
    return text; // 오류 시 원본 반환
  }
}

/**
 * 문자열 복호화 함수 (AES)
 * @param encoded AES 암호화된 문자열
 * @returns 복호화된 문자열
 */
export function decrypt(encoded: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encoded, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("복호화 중 오류 발생", error);
    return ""; // 오류 시 빈 문자열 반환
  }
}

/**
 * 타입 호환성을 갖춘 암호화 스토리지 핸들러
 * @param index 반복문 인덱스
 * @returns 목원 길잡이 Mokwon Guide {index + 1}
 */
export const encryptedStorage = {
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    if (item === null) return null;

    try {
      const decrypted = decrypt(item);
      // 문자열을 객체로 파싱
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("복호화 또는 파싱 중 오류 발생", error);
      return []; // 오류 시 기본값 반환
    }
  },

  setItem: (key: string, value: string[]): void => {
    try {
      // 객체를 문자열로 직렬화 후 암호화
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, encrypt(serialized));
    } catch (error) {
      console.error("직렬화 또는 암호화 중 오류 발생", error);
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};

/**
 * 검색 기록에 항목 추가 (중복 제거)
 * @param historyArray 기존 검색 기록 배열
 * @param newItem 추가할 새 항목
 * @param itemId 항목의 ID (선택적)
 * @param itemType 항목의 타입 (선택적)
 * @returns 업데이트된 검색 기록 배열
 */
// export const addToSearchHistory = (
//   historyArray: string[] | null,
//   newItem: string,
//   itemId?: string,
//   itemType?: ItemType
// ): string[] => {
//   // null 또는 undefined 처리
//   const currentHistory = historyArray || [];

//   // 건물인 경우는 이름으로만 비교
//   if (!itemId || itemType === ItemType.Building) {
//     // 이미 존재하는 항목인지 확인
//     const existingIndex = currentHistory.indexOf(newItem);

//     // 이미 존재하면 해당 항목을 제거한 후 맨 앞에 추가
//     if (existingIndex >= 0) {
//       const updatedHistory = [...currentHistory];
//       updatedHistory.splice(existingIndex, 1); // 기존 항목 제거
//       return [newItem, ...updatedHistory]; // 맨 앞에 추가
//     }

//     // 존재하지 않으면 맨 앞에 추가
//     return [newItem, ...currentHistory];
//   }

//   // 시설인 경우: 이름과 ID를 모두 비교하여 중복 체크
//   const itemWithId = `${newItem} [${itemId}]`;

//   // 이미 존재하는 항목이 있는지 확인
//   const existingIndex = currentHistory.findIndex((item) => {
//     // "이름 [ID]" 형식으로 저장된 항목이 있는지 확인
//     return (
//       item === newItem ||
//       item === itemWithId ||
//       item.startsWith(`${newItem} [${itemId}]`)
//     );
//   });

//   // 이미 존재하면 해당 항목을 제거한 후 맨 앞에 추가
//   if (existingIndex >= 0) {
//     const updatedHistory = [...currentHistory];
//     updatedHistory.splice(existingIndex, 1); // 기존 항목 제거
//     return [itemWithId, ...updatedHistory]; // 맨 앞에 추가
//   }

//   // 존재하지 않으면 맨 앞에 추가
//   return [itemWithId, ...currentHistory];
// };

/**
 * 검색 기록에서 특정 인덱스 항목 제거
 * @param historyArray 기존 검색 기록 배열
 * @param indexToRemove 제거할 항목 인덱스
 * @returns 업데이트된 검색 기록 배열
 */
export const removeFromSearchHistory = (
  historyArray: string[] | null,
  indexToRemove: number
): string[] => {
  if (!historyArray || historyArray.length === 0) {
    return [];
  }

  const updatedHistory = [...historyArray];
  updatedHistory.splice(indexToRemove, 1);
  return updatedHistory;
};

/**
 * 문자열 변형 함수
 * @param text 변형할 문자열
 * @param isStricted 변형 모드 (true: 특수문자 구분, false: 특수문자 구분하지 않음)
 * @returns 변형된 문자열
 */
export const formatText = (
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
 * 키워드로 건물과 시설을 검색하는 함수
 * @param keyword 검색할 키워드
 * @param maxResults 최대 검색 결과 수 (기본값: 11)
 * @returns 검색 결과 배열
 */
export const searchByKeyword = (
  keyword: string,
  maxResults: number = 10
): SearchResultInterface[] => {
  /*
  첫 글자가 특수문자면 엄격히 검색
  첫 글자가 특수문자가 아니면 특수문자 관계 없이 검색
  두 경우 모두 대소문자, 공백 구분 X
  키워드 공백이면 [] 반환환
  */

  if (!keyword.trim()) return []; // 빈 문자열 처리

  const isFirstCharSpecial = /[^a-z0-9가-힣]/g.test(keyword.charAt(0));
  const formattedKeyword = formatText(keyword, isFirstCharSpecial);

  // 건물 검색
  const buildingResults = buildings.filter((building) => {
    return formatText(building.id + building.name, isFirstCharSpecial).includes(
      formattedKeyword
    );
  });

  // 시설 검색
  const facilityResults = facilities.filter((facility) => {
    return formatText(facility.id + facility.name, isFirstCharSpecial).includes(
      formattedKeyword
    );
  });

  // 검색 결과 정렬
  facilityResults.sort((a, b) => {
    return (
      (b.name.includes(formattedKeyword) ? 1 : 0) -
      (a.name.includes(formattedKeyword) ? 1 : 0)
    );
  });

  const results = [...buildingResults, ...facilityResults];
  return results.slice(0, maxResults);
};

/**
 * 건물 또는 시설에 대한 URL 생성
 * @param item 건물 또는 시설 객체
 * @returns 해당 항목의 상세 페이지 URL
 */
export const getItemUrl = (item: SearchResultInterface): string => {
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
