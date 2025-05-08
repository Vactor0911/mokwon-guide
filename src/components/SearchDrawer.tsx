import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
  ListItemButton,
} from "@mui/material";
import { theme } from "../theme";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { isSearchDrawerOpenAtom, searchHistoryAtom } from "../states";
import { encryptedStorage } from "../utils"; // 암호화된 스토리지 핸들러
import buildings from "../assets/buildings.json"; // 건물 데이터
import buildingLayouts from "../assets/building_layouts.json"; // 시설 데이터

// 검색 결과 인터페이스 정의
interface SearchResult {
  id: string;
  name: string;
  type: "building" | "facility";
  category: number;
  // 우선순위 1: 첫글자 건물, 2: 포함 건물, 3: 첫글자 시설, 4: 포함 시설
}

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

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchResults([]);
    setIsSearching(false);
    setSearchData("");
  }, [setIsOpen]);

  // 검색 결과 찾기 함수 (검색어에 따라 건물 및 시설 필터링)
  const findSearchResults = useCallback((query: string) => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];

    // 1. 검색어의 첫 글자로 시작하는 건물
    const firstCharBuilding = buildings.filter((building) => {
      const buildingName = building.name.replace("관", "").trim(); // 약어 처리 (예: 공학관 -> 공학)
      return buildingName.startsWith(query) || building.name.startsWith(query);
    });

    firstCharBuilding.forEach((building) => {
      results.push({
        id: building.alpha,
        name: building.name,
        type: "building",
        category: 1,
      });
    });

    // 2. 검색어를 포함하는 건물
    const includingBuilding = buildings.filter((building) => {
      const buildingName = building.name.replace("관", "").trim(); // 약어 처리
      return (
        (buildingName.includes(query) || building.name.includes(query)) &&
        !buildingName.startsWith(query) &&
        !building.name.startsWith(query)
      );
    });

    includingBuilding.forEach((building) => {
      results.push({
        id: building.alpha,
        name: building.name,
        type: "building",
        category: 2,
      });
    });

    // 3. 검색어의 첫 글자로 시작하는 시설
    const firstCharFacility = buildingLayouts.filter((facility) =>
      facility.name.startsWith(query)
    );

    firstCharFacility.forEach((facility) => {
      results.push({
        id: facility.id,
        name: facility.name,
        type: "facility",
        category: 3,
      });
    });

    // 4. 검색어를 포함하는 시설
    const includingFacility = buildingLayouts.filter(
      (facility) =>
        facility.name.includes(query) && !facility.name.startsWith(query)
    );

    includingFacility.forEach((facility) => {
      results.push({
        id: facility.id,
        name: facility.name,
        type: "facility",
        category: 4,
      });
    });

    // 정렬: 카테고리별로 오름차순 정렬
    results.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category - b.category;
      }
      return a.name.localeCompare(b.name, "ko");
    });

    // 결과를 11개로 제한
    return results.slice(0, 11);
  }, []);

  // 검색 폼 제출 시 처리 (검색 버튼 클릭 또는 엔터 키)
  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      // 검색어가 비어있으면 실행 중지
      if (!searchData.trim()) return;

      // 검색 실행 및 결과 표시
      setIsSearching(true);
      const results = findSearchResults(searchData);
      setSearchResults(results);
    },
    [searchData, findSearchResults]
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
        const results = findSearchResults(newValue);
        setSearchResults(results);
      }
    },
    [findSearchResults]
  );

  // 검색어 삭제 버튼 클릭 시 상태 업데이트
  const handleDelete = useCallback(() => {
    setSearchData("");
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  // 전체 검색 기록 지우기
  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
    // 로컬 스토리지에서도 검색 기록 삭제
    encryptedStorage.removeItem("mokwon-search-history");
  }, [setSearchHistory]);

  // 검색 기록 아이템 클릭 시
  const handleHistoryItemClick = useCallback(
    (item: string) => {
      // 검색 결과 모두 지우기
      setSearchResults([]);

      // 검색 기록의 이름과 일치하는 건물 또는 시설 찾기
      const buildingMatch = buildings.find(
        (building) => building.name === item
      );
      const facilityMatch = buildingLayouts.find(
        (facility) => facility.name === item
      );

      // 즉시 페이지 이동 처리
      if (buildingMatch) {
        window.location.href = `/detail?building=${buildingMatch.alpha}`;
        return;
      } else if (facilityMatch) {
        const buildingCode = facilityMatch.id.substring(0, 1);
        window.location.href = `/detail?building=${buildingCode}&facility=${facilityMatch.id}`;
        return;
      }

      // 일치하는 항목이 없는 경우만 검색어 세팅 및 검색 결과 표시
      setSearchData(item);
      setIsSearching(true);
      const results = findSearchResults(item);
      setSearchResults(results);
    },
    [findSearchResults]
  );

  // 검색 결과 아이템 클릭 시
  const handleResultItemClick = useCallback(
    (item: SearchResult) => {
      // 디버깅용 콘솔 로그 추가
      console.log("검색 결과 클릭:", item);

      // searchHistory가 null인 경우 빈 배열로 처리
      const currentHistory = searchHistory || [];

      // 검색 기록에 항목 이름 추가 (중복 방지)
      if (!currentHistory.includes(item.name)) {
        const updatedHistory = [item.name, ...currentHistory];
        setSearchHistory(updatedHistory);
        // 저장
        encryptedStorage.setItem("mokwon-search-history", updatedHistory);
      }

      // 중요: 다른 상태 업데이트 전에 즉시 페이지 이동 처리
      if (item.type === "building") {
        // setTimeout을 사용해 React 렌더링 사이클 이후에 이동하도록 보장
        setTimeout(() => {
          window.location.href = `/detail?building=${item.id}`;
        }, 0);
      } else {
        // 시설 클릭 시 - 건물 정보를 찾아서 해당 건물 페이지로 이동
        const buildingCode = item.id.substring(0, 1);
        setTimeout(() => {
          window.location.href = `/detail?building=${buildingCode}&facility=${item.id}`;
        }, 0);
      }
    },
    [searchHistory, setSearchHistory]
  );

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

  // 안전하게 searchHistory에 접근하기 위한 변수
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const safeSearchHistory = searchHistory || [];

  // 특정 검색 기록 항목 삭제 함수 추가
  const handleDeleteHistoryItem = useCallback(
    (index: number, event: React.MouseEvent) => {
      // 이벤트 버블링 방지
      event.stopPropagation();

      // 안전하게 배열 복사
      const updatedHistory = [...safeSearchHistory];
      // 해당 인덱스의 항목 제거
      updatedHistory.splice(index, 1);

      // 상태 업데이트
      setSearchHistory(updatedHistory);

      // 로컬 스토리지 업데이트
      encryptedStorage.setItem("mokwon-search-history", updatedHistory);
    },
    [safeSearchHistory, setSearchHistory]
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
        </Stack>

        {/* 검색 결과 또는 최근 검색어 표시 영역 */}
        <Box sx={{ flex: 1, overflow: "auto", pt: 1 }}>
          {isSearching && searchResults.length > 0 ? (
            // 검색 결과 표시
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <List>
                {searchResults.map((result, index) => {
                  return (
                    <Box key={result.id + index}>
                      {index > 0 && <Divider />}
                      <ListItem
                        component="div"
                        disablePadding
                        sx={{
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                      >
                        <ListItemButton
                          onClick={() => handleResultItemClick(result)}
                        >
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
                              result.type === "building"
                                ? "건물"
                                : `시설 (${result.id})`
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    </Box>
                  );
                })}
              </List>
            </Paper>
          ) : isSearching && searchResults.length === 0 ? (
            // 검색 결과가 없을 때
            <Typography variant="body1" align="center" sx={{ color: "gray" }}>
              검색 결과가 없습니다.
            </Typography>
          ) : (
            // 최근 검색어 표시
            <Box>
              {safeSearchHistory.length > 0 ? (
                <Paper elevation={0} sx={{ borderRadius: 2 }}>
                  <List>
                    {safeSearchHistory.map((item, index) => {
                      // 검색 기록 아이템이 건물인지 시설인지 확인
                      const buildingMatch = buildings.find(
                        (building) => building.name === item
                      );
                      const facilityMatch = buildingLayouts.find(
                        (facility) => facility.name === item
                      );

                      return (
                        <ListItem
                          key={index}
                          component="div"
                          disablePadding
                          sx={{
                            "&:hover": { backgroundColor: "#f0f0f0" },
                          }}
                        >
                          <ListItemButton
                            onClick={() => handleHistoryItemClick(item)}
                            sx={{
                              position: "relative",
                              "&:hover .deleteButton": {
                                opacity: 1,
                                visibility: "visible",
                              },
                            }}
                          >
                            {buildingMatch ? (
                              <ApartmentIcon
                                fontSize="large"
                                sx={{
                                  mr: 2,
                                  color: theme.palette.primary.main,
                                }}
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
                              primary={item}
                              secondary={
                                buildingMatch
                                  ? "건물"
                                  : facilityMatch
                                  ? `시설 (${facilityMatch.id})`
                                  : "검색어"
                              }
                            />
                            <IconButton
                              edge="end"
                              disableRipple
                              aria-label="delete"
                              onClick={(e) => handleDeleteHistoryItem(index, e)}
                              className="deleteButton"
                              sx={{
                                color: "#666666",
                                mr: 0.5,
                                backgroundColor: "#F1F1F1",
                                opacity: 0,
                                visibility: "hidden",
                                transition: "opacity 0.2s, visibility 0.2s",
                              }}
                            >
                              <CloseRoundedIcon />
                            </IconButton>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              ) : (
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ color: "gray" }}
                >
                  최근 검색 기록이 없습니다.
                </Typography>
              )}

              <Stack direction="row" justifyContent="flex-end">
                {safeSearchHistory.length > 0 && (
                  <Button
                    startIcon={<DeleteIcon />}
                    size="small"
                    onClick={handleClearHistory}
                    sx={{
                      color: "#AC1D3D",
                      fontWeight: "bold",
                      pr: 2,
                    }}
                  >
                    검색 기록 지우기
                  </Button>
                )}
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>
    </Drawer>
  );
};

export default SearchDrawer;
