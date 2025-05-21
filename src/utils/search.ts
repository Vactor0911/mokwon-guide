import { formatString, getBuildingId, getFacilityFloor } from ".";
import buildings from "../assets/buildings.json"; // 건물 데이터 가져오기
import facilities from "../assets/facilities.json"; // 시설 데이터 가져오기

/**
 * 검색 결과 인터페이스
 */
export interface FacilityInterface {
  id: string;
  name: string;
}

/**
 * 키워드로 건물과 시설을 검색하는 함수
 * @param keyword 검색할 키워드
 * @param maxResults 최대 검색 결과 수 (기본값: 11)
 * @param buildingId 건물 ID : 특정 건물 내에서만 시설을 검색 (optional)
 * @returns 검색된 건물 및 시설 객체 배열
 */
export const searchByKeyword = (
  keyword: string,
  maxResults: number = 10,
  buildingId?: string
): FacilityInterface[] => {
  if (!keyword.trim()) return []; // 빈 문자열 처리

  const isFirstCharSpecial = /[^a-z0-9가-힣]/g.test(keyword.charAt(0));
  const formattedKeyword = formatString(keyword, isFirstCharSpecial);

  // 건물 검색
  let buildingResults: FacilityInterface[] = [];
  if (!buildingId) {
    buildingResults = buildings.filter((building) => {
      return formatString(
        building.id + building.name,
        isFirstCharSpecial
      ).includes(formattedKeyword);
    });
  }

  // 시설 검색
  const facilityResults = facilities.filter((facility) => {
    return (
      formatString(facility.id + facility.name, isFirstCharSpecial).includes(
        formattedKeyword
      ) && facility.id.startsWith(buildingId || "")
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
 * id로 건물과 시설을 검색하는 함수
 * @param id 건물과 시설 id
 * @returns 검색한 건물 혹은 시설 객체
 */
export const searchById = (id: string): FacilityInterface | undefined => {
  const searchPool = [...buildings, ...facilities];
  const result = searchPool.find((facility) => facility.id === id);
  return result;
};

/**
 * 특정 건물의 특정 층수에 위치한 시설을 검색하는 함수
 * @param buildingId 건물 ID
 * @param floor 건물 층수
 * @returns 검색한 건물의 층수에 위치한 시설 객체 배열
 */
export const findFacilitiesByFloor = (buildingId: string, floor: string) => {
  const result = facilities.filter(
    (facility) =>
      getBuildingId(facility.id) === buildingId &&
      getFacilityFloor(facility.id) === floor
  );
  return result;
};
