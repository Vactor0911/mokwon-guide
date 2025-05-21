import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { encryptedStorage } from "../utils/security";
import { FacilityInterface } from "../utils/search";
import { getBuildingFloors } from "../utils";

// 좌측 상단 메뉴 아이콘 클릭 시 열리는 Drawer 상태
export const isDrawerOpenAtom = atom(false);

// 우측 상단 검색 아이콘 클릭 시 열리는 Drawer 상태
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

export const buildingFloorsAtom = atom<Record<string, string[]>>(
  getBuildingFloors()
); // 층수 상태
