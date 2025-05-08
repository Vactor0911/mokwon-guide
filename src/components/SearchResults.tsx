import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { theme } from "../theme";
import {
  SearchResult,
  addToSearchHistory,
  encryptedStorage,
  getItemUrl,
} from "../utils";
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
  // 검색 결과 아이템 클릭 시
  const handleResultItemClick = (item: SearchResult) => {
    // 검색 기록에 항목 이름 추가
    const updatedHistory = addToSearchHistory(searchHistory, item.name);

    if (updatedHistory !== searchHistory) {
      setSearchHistory(updatedHistory);
      // 저장
      encryptedStorage.setItem("mokwon-search-history", updatedHistory);
    }

    // 중요: 다른 상태 업데이트 전에 즉시 페이지 이동 처리
    setTimeout(() => {
      window.location.href = getItemUrl(item);
    }, 0);
  };

  // 검색어를 강조 표시하는 함수 추가
  const highlightSearchText = useCallback(
    (text: string) => {
      if (!searchData.trim()) return text;

      const parts = text.split(new RegExp(`(${searchData})`, "gi"));

      return (
        <>
          {parts.map((part, index) =>
            part.toLowerCase() === searchData.toLowerCase() ? (
              <span
                key={index}
                style={{ color: "#AC1D3D", fontWeight: "bold" }}
              >
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      );
    },
    [searchData]
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
            <ListItem
              component="div"
              disablePadding
              sx={{
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <ListItemButton onClick={() => handleResultItemClick(result)}>
                {result.type === "building" ? (
                  <ApartmentIcon
                    fontSize="large"
                    sx={{ mr: 2, color: theme.palette.primary.main }}
                  />
                ) : (
                  <LocationOnIcon
                    fontSize="large"
                    sx={{
                      mr: 2,
                      color: theme.palette.secondary.main,
                    }}
                  />
                )}
                <ListItemText
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    },
                  }}
                  primary={highlightSearchText(result.name)}
                  secondary={
                    result.type === "building" ? "건물" : `시설 (${result.id})`
                  }
                />
              </ListItemButton>
            </ListItem>
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default SearchResults;
