import {
  Box,
  Button,
  Drawer,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import {
  isSearchDrawerOpenAtom,
  keywordAtom,
  searchHistoryAtom,
  searchResultAtom,
} from "../states";
import { useCallback, useRef } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { theme } from "../theme";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { grey } from "@mui/material/colors";
import { searchById, searchByKeyword } from "../utils/search";
import FacilityItemButton from "./SearchResultButton";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const SearchDrawer = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useAtom(
    isSearchDrawerOpenAtom
  ); // 검색 드로어 열림 관련
  const [keyword, setKeyword] = useAtom(keywordAtom); // 검색어
  const inputRef = useRef<HTMLInputElement>(null); // 검색란 ref
  const [searchResults, setSearchResults] = useAtom(searchResultAtom); // 검색 결과
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  // 검색 드로어 닫기
  const handleSearchDrawerClose = useCallback(() => {
    setIsSearchDrawerOpen(false);
  }, [setIsSearchDrawerOpen]);

  // 검색어 변경
  const handleKeywordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newKeyword = event.target.value;
      setKeyword(newKeyword);

      const newSearchResults = searchByKeyword(newKeyword);
      setSearchResults(newSearchResults); // 검색 결과 업데이트
    },
    [setKeyword, setSearchResults]
  );

  // 입력란 키 입력시
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.ctrlKey && event.key === "a") {
        event.preventDefault();
        inputRef.current?.select();
      }
    },
    []
  );

  // 입력란 초기화 버튼 클릭
  const handleClearButtonClick = useCallback(() => {
    setKeyword("");
    setSearchResults([]);
    inputRef.current?.focus(); // 입력란 포커스
  }, [setKeyword, setSearchResults]);

  // 검색 기록 초기화 버튼 클릭
  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  return (
    <Drawer
      open={isSearchDrawerOpen}
      onClose={handleSearchDrawerClose}
      anchor="right"
    >
      <Stack
        sx={{
          width: "100vw",
          height: "100vh",
          maxWidth: "500px",
        }}
      >
        {/* 상단 검색바 */}
        <Stack
          direction="row"
          alignItems="center"
          paddingX={1}
          height="64px"
          gap={1}
          sx={{
            background: theme.palette.primary.main,
            boxShadow: 3,
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton onClick={handleSearchDrawerClose}>
            <ArrowForwardIosRoundedIcon
              sx={{
                color: "white",
              }}
            />
          </IconButton>

          {/* 검색바 */}
          <Stack
            direction="row"
            alignItems="center"
            p={0.5}
            border="3px solid #69172a"
            borderRadius="50px"
            flexGrow={1}
            sx={{
              background: "white",
            }}
          >
            {/* 돋보기 아이콘 */}
            <Box
              borderRadius="50%"
              display="flex"
              p={0.1}
              color="white"
              sx={{
                background: theme.palette.primary.main,
              }}
            >
              <SearchRoundedIcon fontSize="large" />
            </Box>

            {/* 검색란 */}
            <InputBase
              sx={{ mx: 1, flex: 1 }}
              placeholder="건물, 시설 검색"
              value={keyword}
              onChange={handleKeywordChange}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
              inputProps={{
                style: {
                  fontSize: "1.2em",
                  fontWeight: 700,
                },
              }}
            />

            {/* 검색어 초기화 버튼 */}
            <IconButton
              size="small"
              sx={{
                background: "#d9d9d9",
              }}
              onClick={handleClearButtonClick}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* 검색 결과 */}
        <Stack flex={1}>
          {searchResults.length > 0 ? (
            // 검색 기록 있음
            searchResults.map((item, index) => (
              <FacilityItemButton
                key={`search-result-${index}`}
                item={item}
                keyword={keyword}
              />
            ))
          ) : searchHistory && searchHistory.length > 0 ? (
            // 검색 결과 없음 && 검색 기록 있음
            <Stack>
              {/* 검색 기록 버튼 */}
              {searchHistory.map((history, index) => (
                <FacilityItemButton
                  key={`search-history-${index}`}
                  item={searchById(history)!}
                  deleteBtn
                />
              ))}

              {/* 검색 기록 삭제 버튼 */}
              <Box alignSelf="flex-end" m={2} my={1}>
                <Button
                  startIcon={<DeleteRoundedIcon />}
                  onClick={handleClearHistory}
                >
                  <Typography variant="subtitle2">검색 기록 초기화</Typography>
                </Button>
              </Box>
            </Stack>
          ) : (
            // 검색 결과 없음 && 검색 기록 없음
            <Stack height="100%" justifyContent="center">
              <Typography
                variant="h6"
                fontWeight={500}
                textAlign="center"
                color={grey[500]}
              >
                검색 결과가 없습니다.
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default SearchDrawer;
