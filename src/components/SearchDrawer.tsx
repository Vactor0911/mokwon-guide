import {
  Box,
  Drawer,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { theme } from "../theme";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCallback, useState } from "react";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDrawer = (props: SearchDrawerProps) => {
  const { isOpen, onClose } = props;
  const [searchData, setSearchData] = useState(""); // 검색어 입력값

  const handleSearch = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    // 검색 기능 구현
    console.log("검색 실행");
  }, []);

  // 검색어 입력 시 상태 업데이트트
  const handleSearchDataChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchData(event.target.value);
    },
    []
  );

  // 검색어 삭제 버튼 클릭 시 상태 업데이트
  const handleDelete = useCallback(() => {
    setSearchData("");
  }, []);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "500px",
        },
      }}
    >
      <Stack spacing={1}>
        {/* 검색창 헤더 */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            backgroundColor: theme.palette.primary.main,
            padding: "5px 8px",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={onClose}>
            <ArrowForwardIosIcon
              fontSize="large"
              sx={{
                color: "white",
              }}
            />
          </IconButton>

          {/* 검색 입력 */}
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
              sx={{ ml: 1, flex: 1, fontSize: "1.2rem", fontWeight: "bold" }}
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
        </Stack>

        {/* 최근 검색어 또는 검색 결과 표시 영역 */}
        <Box sx={{ mt: 2, color: "white" }}>
          <Typography variant="h6">최근 검색어</Typography>
          {/* 최근 검색어 목록 또는 검색 결과를 여기에 표시 */}
        </Box>
      </Stack>
    </Drawer>
  );
};

export default SearchDrawer;
