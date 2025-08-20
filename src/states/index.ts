import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { encryptedStorage } from "../utils/security";
import { FacilityInterface } from "../utils";
import { getBuildingFloors } from "../utils";

// 층수 상태
export const buildingFloorsAtom = atom<Record<string, string[]>>(
  getBuildingFloors()
);

// 좌측 상단 메뉴 아이콘 클릭 시 열리는 드로어 상태
export const isDrawerOpenAtom = atom(false);

// 우측 상단 검색 아이콘 클릭 시 열리는 드로어 상태
export const isSearchDrawerOpenAtom = atom(false);

// 검색어 상태
export const keywordAtom = atom("");

// 검색 결과 상태
export const searchResultAtom = atom<FacilityInterface[]>([]);

// 검색 기록 상태 (로컬 스토리지)
export const searchHistoryAtom = atomWithStorage<string[]>(
  "mokwon-guide-search-history",
  [],
  encryptedStorage
);

// 건물 상세 정보 드로어 열림 상태
export const isBuildingDetailDrawerOpenAtom = atom(false);

// 건물 상세 정보 드로어에서 선택된 건물 객체 타입
interface buildingDetailDrawerBuildingProps {
  id: string;
  name: string;
}

// 건물 상세 정보 드로어에서 선택된 건물 객체 상태
export const buildingDetailDrawerBuildingAtom =
  atom<buildingDetailDrawerBuildingProps | null>(null);

// 선택된 시설 상태
export const selectedFacilityAtom = atom<FacilityInterface | null>(null);

// 네비게이션 경로 상태
export const pointAtom = atom<{
  origin: string;
  destination: string;
}>({
  origin: "",
  destination: "",
});
