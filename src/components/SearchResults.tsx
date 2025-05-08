import { Box, Divider, List, Paper, Typography } from "@mui/material";
import {
  SearchResult,
  addToSearchHistory,
  encryptedStorage,
  getItemUrl,
} from "../utils";
import SearchResultItem from "./SearchResultItem";
import { useCallback } from "react";

interface SearchResultsProps {
  results: SearchResult[];
  searchData: string;
  searchHistory: string[];
  setSearchHistory: (history: string[]) => void;
}

const SearchResults = ({
  results,
  searchData,
  searchHistory,
  setSearchHistory,
}: SearchResultsProps) => {
  // useCallback으로 핸들러 메모이제이션
  const handleResultItemClick = useCallback(
    (item: SearchResult) => {
      // 검색 기록에 항목 이름 추가
      const updatedHistory = addToSearchHistory(
        searchHistory,
        item.name,
        item.id,
        item.type
      );
      
      if (updatedHistory !== searchHistory) {
        setSearchHistory(updatedHistory);
        // 저장
        encryptedStorage.setItem("mokwon-search-history", updatedHistory);
      }

      // 중요: 다른 상태 업데이트 전에 즉시 페이지 이동 처리
      setTimeout(() => {
        window.location.href = getItemUrl(item);
      }, 0);
    },
    [searchHistory, setSearchHistory]
  );

  // 검색 결과가 없을 때
  if (results.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ color: "gray" }}>
        검색 결과가 없습니다.
      </Typography>
    );
  }

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <List>
        {results.map((result, index) => (
          <Box key={result.id + index}>
            {index > 0 && <Divider />}
            <SearchResultItem
              result={result}
              searchData={searchData}
              onClick={handleResultItemClick}
            />
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default SearchResults;
