import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { encryptedStorage } from "../utils";


// 좌측 상단 메뉴 아이콘 클릭 시 열리는 Drawer 상태 관리 아톰
export const isDrawerOpenAtom = atom(false);

// 우측 상단 검색 아이콘 클릭 시 열리는 Drawer 상태 관리 아톰
export const isSearchDrawerOpenAtom = atom(false);

// 검색 기록 - 암호화된 형태로 localStorage에 저장
export const searchHistoryAtom = atomWithStorage<string[]>(
  'mokwon-search-history', 
  [], 
  encryptedStorage
);