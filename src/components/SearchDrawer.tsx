import {
  Box,
  Drawer,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { isSearchDrawerOpenAtom } from "../states";
import { useCallback, useRef, useState } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { theme } from "../theme";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { grey } from "@mui/material/colors";
import { searchByKeyword, SearchResultInterface } from "../utils";
import SearchResultButton from "./SearchResultButton";

const SearchDrawer = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useAtom(
    isSearchDrawerOpenAtom
  ); // 검색 드로어 열림 관련
  const [keyword, setKeyword] = useState(""); // 검색어
  const inputRef = useRef<HTMLInputElement>(null); // 검색란 ref
  const [searchResults, setSearchResults] = useState<SearchResultInterface[]>([]); // 검색 결과

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
      console.log(newSearchResults); // 검색 결과 콘솔 출력
    },
    []
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
  }, []);

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
                },
              }}
            />

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
        <Stack
          flex={1}
          justifyContent={searchResults.length !== 0 ? "flex-start" : "center"}
        >
          {searchResults.length !== 0 ? (
            searchResults.map((item, index) => (
              <SearchResultButton
                key={`search-result-${index}`}
                item={item}
                keyword={keyword}
              />
            ))
          ) : (
            <Typography
              variant="h6"
              fontWeight={500}
              textAlign="center"
              color={grey[500]}
            >
              검색 결과가 없습니다.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default SearchDrawer;
