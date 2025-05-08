import { Box, Drawer, IconButton, InputBase, Stack } from "@mui/material";
import { theme } from "../theme";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { isSearchDrawerOpenAtom, searchHistoryAtom } from "../states";
import {
  encryptedStorage,
  findItemByName,
  findSearchResults,
  getItemUrl,
  SearchResult,
} from "../utils"; // 유틸리티 함수들
import buildings from "../assets/buildings.json"; // 건물 데이터
import buildingLayouts from "../assets/building_layouts.json"; // 시설 데이터
import SearchResults from "./SearchResults"; // 검색 결과 컴포넌트
import SearchHistory from "./SearchHistory"; // 검색 기록 컴포넌트

const SearchDrawer = () => {
  const [isOpen, setIsOpen] = useAtom(isSearchDrawerOpenAtom);
  const [searchData, setSearchData] = useState(""); // 검색어 입력값
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); // 검색 결과
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); // 검색 기록
  const [isSearching, setIsSearching] = useState(false); // 검색 중 상태

  // SearchDrawer가 마운트될 때 searchHistory 초기화 확인
  useEffect(() => {
    // searchHistory가 null인 경우 빈 배열로 초기화
    if (searchHistory === null) {
      setSearchHistory([]);
    }
  }, [searchHistory, setSearchHistory]);

  // SearchDrawer가 열릴 때 로컬 스토리지에서 검색 기록 로드
  useEffect(() => {
    if (isOpen) {
      try {
        // encryptedStorage에서 검색 기록 가져오기
        const storedHistory = encryptedStorage.getItem("mokwon-search-history");
        if (storedHistory !== null && Array.isArray(storedHistory)) {
          setSearchHistory(storedHistory);
        } else {
          // 유효한 배열이 아닌 경우 빈 배열로 초기화
          setSearchHistory([]);
        }
      } catch (error) {
        console.error("검색 기록을 불러오는 중 오류 발생", error);
        setSearchHistory([]);
      }
    }
  }, [isOpen, setSearchHistory]);

  // 검색창 닫기 핸들러
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchResults([]);
    setIsSearching(false);
    setSearchData("");
  }, [setIsOpen]);

  // 검색 폼 제출 시 처리 (검색 버튼 클릭 또는 엔터 키)
  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      // 검색어가 비어있으면 실행 중지
      if (!searchData.trim()) return;

      // 검색 실행 및 결과 표시
      setIsSearching(true);
      const results = findSearchResults(searchData, buildings, buildingLayouts);
      setSearchResults(results);
    },
    [searchData]
  );

  // 검색어 입력 시 실시간 검색 처리
  const handleSearchDataChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setSearchData(newValue);

      if (!newValue.trim()) {
        setIsSearching(false);
        setSearchResults([]);
      } else {
        setIsSearching(true);
        const results = findSearchResults(newValue, buildings, buildingLayouts);
        setSearchResults(results);
      }
    },
    []
  );

  // 검색어 삭제 버튼 클릭 시 상태 업데이트
  const handleDelete = useCallback(() => {
    setSearchData("");
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // 검색 기록 아이템 클릭 시
  const handleHistoryItemClick = useCallback((item: string) => {
    // 검색 결과 모두 지우기
    setSearchResults([]);

    // 검색 기록의 이름과 일치하는 건물 또는 시설 찾기
    const { buildingMatch, facilityMatch } = findItemByName(
      item,
      buildings,
      buildingLayouts
    );

    // 즉시 페이지 이동 처리
    if (buildingMatch) {
      window.location.href = getItemUrl(buildingMatch);
      return;
    } else if (facilityMatch) {
      window.location.href = getItemUrl(facilityMatch);
      return;
    }

    // 일치하는 항목이 없는 경우만 검색어 세팅 및 검색 결과 표시
    setSearchData(item);
    setIsSearching(true);
    const results = findSearchResults(item, buildings, buildingLayouts);
    setSearchResults(results);
  }, []);

  // 안전하게 searchHistory에 접근하기 위한 변수
  const safeSearchHistory = searchHistory || [];

  // 검색 입력 UI
  const searchInputUI = useMemo(
    () => (
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "25px",
          border: "3px solid #69172A",
          padding: "0px 3px",
        }}
      >
        <IconButton
          type="submit"
          disableRipple
          sx={{
            color: "white",
            backgroundColor: theme.palette.primary.main,
            borderRadius: "50%",
            padding: "4px",
            margin: "4px",
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main} !important`,
            },
          }}
        >
          <SearchRoundedIcon fontSize="large" />
        </IconButton>

        <InputBase
          placeholder="건물, 시설 검색"
          sx={{ ml: 1, flex: 1, fontSize: "1.3rem", fontWeight: "bold" }}
          autoFocus
          value={searchData}
          onChange={handleSearchDataChange}
        />
        <IconButton
          type="button"
          onClick={handleDelete}
          sx={{
            color: "#666666",
            borderRadius: "50%",
            padding: "4px",
            margin: "4px",
          }}
        >
          <CloseRoundedIcon fontSize="large" />
        </IconButton>
      </Box>
    ),
    [searchData, handleSearchDataChange, handleSearch, handleDelete]
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        spacing={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 검색창 헤더 */}
        <Stack
          direction="row"
          alignItems="center"
          position={"sticky"}
          top={0}
          zIndex={1000}
          sx={{
            backgroundColor: theme.palette.primary.main,
            padding: "5px 8px",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={handleClose}>
            <ArrowForwardIosIcon
              fontSize="large"
              sx={{
                color: "white",
              }}
            />
          </IconButton>

          {/* 검색 입력 - 메모이제이션된 컴포넌트 */}
          {searchInputUI}
        </Stack>

        {/* 검색 결과 또는 최근 검색어 표시 영역 */}
        <Box sx={{ flex: 1, overflow: "auto", pt: 1 }}>
          {isSearching ? (
            <SearchResults
              results={searchResults}
              searchData={searchData}
              searchHistory={safeSearchHistory}
              setSearchHistory={setSearchHistory}
            />
          ) : (
            <SearchHistory
              searchHistory={safeSearchHistory}
              setSearchHistory={setSearchHistory}
              onItemClick={handleHistoryItemClick}
            />
          )}
        </Box>
      </Stack>
    </Drawer>
  );
};

export default SearchDrawer;
