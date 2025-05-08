import CryptoJS from 'crypto-js';

/**
 * 샘플 텍스트 생성 함수
 * @param index 반복문 인덱스
 * @returns 목원 길잡이 Mokwon Guide {index + 1}
 */
export const getSampleText = (index: number) => {
  return `목원 길잡이 Mokwon Guide ${index + 1}`;
};

// 환경 변수에서 암호화 키 가져오기
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY


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
    return ''; // 오류 시 빈 문자열 반환
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
  }
};

/**
 * 검색 결과 타입 정의
 * 건물과 시설을 포함하는 검색 결과 객체
 * @property {string} id - 건물 또는 시설의 고유 ID
 * @property {string} name - 건물 또는 시설의 이름
 * @property {string} type - 건물 또는 시설의 타입 (building 또는 facility)
 * @property {number} category - 검색 결과의 카테고리 
 * (1: 건물 첫 글자, 2: 건물 포함, 3: 시설 첫 글자, 4: 시설 포함)
 */
export interface Building {
  alpha: string;
  name: string;
}

export interface Facility {
  id: string;
  name: string;
}

export interface SearchResult {
  id: string;
  name: string;
  type: "building" | "facility";
  category: number;
}

/**
 * 검색 결과 찾기 함수
 * @param query 검색어
 * @param buildings 건물 데이터 배열
 * @param facilities 시설 데이터 배열
 * @returns 검색 결과 배열 (최대 11개)
 */
export const findSearchResults = (
  query: string,
  buildings: Building[],
  facilities: Facility[]
): SearchResult[] => {
  if (!query.trim()) return [];
  const results: SearchResult[] = [];

  // 1. 검색어의 첫 글자로 시작하는 건물
  const firstCharBuilding = buildings.filter((building) => {
    const buildingName = building.name.replace("관", "").trim();
    return buildingName.startsWith(query) || building.name.startsWith(query);
  });
  firstCharBuilding.forEach((building) => {
    results.push({
      id: building.alpha,
      name: building.name,
      type: "building",
      category: 1,
    });
  });

  // 2. 검색어를 포함하는 건물 (단, 시작하는 경우 제외)
  const includingBuilding = buildings.filter((building) => {
    const buildingName = building.name.replace("관", "").trim();
    return (
      (buildingName.includes(query) || building.name.includes(query)) &&
      !buildingName.startsWith(query) &&
      !building.name.startsWith(query)
    );
  });
  includingBuilding.forEach((building) => {
    results.push({
      id: building.alpha,
      name: building.name,
      type: "building",
      category: 2,
    });
  });

  // 3. 검색어의 첫 글자로 시작하는 시설
  const firstCharFacility = facilities.filter((facility) =>
    facility.name.startsWith(query)
  );
  firstCharFacility.forEach((facility) => {
    results.push({
      id: facility.id,
      name: facility.name,
      type: "facility",
      category: 3,
    });
  });

  // 4. 검색어를 포함하는 시설 (단, 시작하는 경우 제외)
  const includingFacility = facilities.filter(
    (facility) =>
      facility.name.includes(query) && !facility.name.startsWith(query)
  );
  includingFacility.forEach((facility) => {
    results.push({
      id: facility.id,
      name: facility.name,
      type: "facility",
      category: 4,
    });
  });

  // 결과 정렬: 카테고리별 오름차순, 이름(한글 기준) 오름차순
  results.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category - b.category;
    }
    return a.name.localeCompare(b.name, "ko");
  });

  // 결과를 최대 11개로 제한
  return results.slice(0, 11);
};



/**
 * 이름으로 건물 또는 시설 찾기
 * @param name 건물 또는 시설 이름
 * @param buildings 건물 배열
 * @param facilities 시설 배열
 * @returns {building, facility} 찾은 건물과 시설 객체
 */
export const findItemByName = (name: string, buildings: Building[], facilities: Facility[]) => {
  const buildingMatch = buildings.find((building) => building.name === name);
  const facilityMatch = facilities.find((facility) => facility.name === name);
  
  return { buildingMatch, facilityMatch };
};



/**
 * 건물 또는 시설에 대한 URL 생성
 * @param item 건물 또는 시설 객체
 * @returns 해당 항목의 상세 페이지 URL
 */
export const getItemUrl = (item: SearchResult | Building | Facility): string => {
  // SearchResult 타입인 경우
  if ('type' in item) {
    if (item.type === "building") {
      return `/detail?building=${item.id}`;
    } else {
      const buildingCode = item.id.substring(0, 1);
      return `/detail?building=${buildingCode}&facility=${item.id}`;
    }
  } 
  // Building 타입인 경우
  else if ('alpha' in item) {
    return `/detail?building=${item.alpha}`;
  } 
  // Facility 타입인 경우
  else if ('id' in item) {
    const buildingCode = item.id.substring(0, 1);
    return `/detail?building=${buildingCode}&facility=${item.id}`;
  }
  
  return '/'; // 기본값
};


/**
 * 검색 기록에 항목 추가 (중복 제거)
 * @param historyArray 기존 검색 기록 배열
 * @param newItem 추가할 새 항목
 * @returns 업데이트된 검색 기록 배열
 */
export const addToSearchHistory = (historyArray: string[] | null, newItem: string): string[] => {
  // null 또는 undefined 처리
  const currentHistory = historyArray || [];
  
  // 이미 존재하는 항목이면 그대로 반환
  if (currentHistory.includes(newItem)) {
    return currentHistory;
  }
  
  // 새 항목을 배열 앞에 추가 (최신 기록이 먼저 오도록)
  return [newItem, ...currentHistory];
};



/**
 * 검색 기록에서 특정 인덱스 항목 제거
 * @param historyArray 기존 검색 기록 배열
 * @param indexToRemove 제거할 항목 인덱스
 * @returns 업데이트된 검색 기록 배열
 */
export const removeFromSearchHistory = (historyArray: string[] | null, indexToRemove: number): string[] => {
  if (!historyArray || historyArray.length === 0) {
    return [];
  }
  
  const updatedHistory = [...historyArray];
  updatedHistory.splice(indexToRemove, 1);
  return updatedHistory;
};
