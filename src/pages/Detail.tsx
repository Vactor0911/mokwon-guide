import {
  Box,
  Button,
  Container,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router";
import ElevatorIcon from "../assets/icons/elevator.png";
import WcIcon from "../assets/icons/wc.png";
import { theme } from "../theme";
import { useCallback, useEffect, useRef, useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  FacilityInterface,
  findFacilitiesByFloor,
  searchByKeyword,
} from "../utils/search";
import Footer from "../components/Footer";
import { useAtomValue } from "jotai";
import { buildingFloorsAtom } from "../states";
import buildings from "../assets/buildings.json";

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const buildingId = queryParams.get("building") || "D";
  const building = buildings.find((building) => building.id === buildingId);

  const [buildingName, setBuildingName] = useState(""); // 건물명 상태
  const floors = useAtomValue(buildingFloorsAtom); // 층수 상태
  const [floor, setFloor] = useState("1F"); // 건물 배치도 층수 상태
  const floorButtonElement = useRef<HTMLButtonElement>(null); // 층수 선택 버튼
  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false); // 층수 선택 메뉴 상태
  const [facilities, setFacilities] = useState<FacilityInterface[]>([]); // 시설 정보 상태
  const [keyword, setKeyword] = useState(""); // 검색어 상태

  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  // 이미지 참조를 위한 ref 추가
  const imageRef = useRef<HTMLImageElement>(null);
  // 스케일 계수를 저장할 상태 추가
  const [scaleFactor, setScaleFactor] = useState(1);
  // 테두리 요소에 대한 ref 추가
  const highlightBoxRef = useRef<HTMLDivElement>(null);

  // 페이지 쿼리 파라미터 변경시 시설 정보 재검색
  useEffect(() => {
    setFloor("1F"); // 층수 초기화
    setKeyword(""); // 검색어 초기화
    setBuildingName(`${building?.id} ${building?.name}`);

    const newFacilities = findFacilitiesByFloor(buildingId, "1F");
    setFacilities(newFacilities);
  }, [building?.id, building?.name, buildingId, location]);

  // 층수 선택 메뉴 열기
  const handleFloorMenuOpen = useCallback(() => {
    setIsFloorMenuOpen(true);
  }, []);

  // 층수 선택 메뉴 닫기
  const handleFloorMenuClose = useCallback(() => {
    setIsFloorMenuOpen(false);
  }, []);

  // 층수 선택
  const handleFloorChange = useCallback(
    (newFloor: string) => {
      setIsFloorMenuOpen(false);
      setFloor(newFloor);

      // 선택한 층수에 해당하는 시설 정보 필터링
      const newFacilities = findFacilitiesByFloor(buildingId, newFloor);
      setFacilities(newFacilities);
    },
    [buildingId]
  );

  // 호실 검색어 변경
  const handleKeywordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newKeyword = event.target.value;
      setKeyword(newKeyword);

      // 검색어에 해당하는 시설 정보 필터링
      if (newKeyword.trim() === "") {
        // 검색어가 없다면 종료
        setFacilities(findFacilitiesByFloor(buildingId, floor));
        return;
      }
      const newFacilities = searchByKeyword(newKeyword, 999, buildingId);

      if (newFacilities.length === 0) {
        setFacilities([{ id: "", name: "검색 결과가 없습니다." }]);
        return;
      }
      setFacilities(newFacilities);
    },
    [buildingId, floor]
  );

  // 건물 배치도 이미지 URL 생성
  const getBuildingLayoutImage = useCallback(() => {
    const imageUrl = `./images/building_layouts/${buildingId.toLowerCase()}_${floor
      .replace("F", "")
      .toLowerCase()}.jpg`;
    return imageUrl;
  }, [buildingId, floor]);

  // 이미지 로드 시 스케일 계수 계산
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return;

    // 렌더링된 이미지의 실제 너비
    const renderedWidth = imageRef.current.clientWidth;

    // 이미지의 원본 너비를 사용 (naturalWidth는 이미지 파일의 실제 픽셀 너비)
    const originalWidth = imageRef.current.naturalWidth;

    // 스케일 계수 계산 (안전장치: 원본 너비가 0인 경우 1로 설정)
    const newScaleFactor =
      originalWidth > 0 ? renderedWidth / originalWidth : 1;
    setScaleFactor(newScaleFactor);
  }, []);

  // 호실 클릭 시 해당 호실로 스크롤 이동 및 테두리 표시
  const handleFacilityClick = useCallback((facilityId: string) => {
    setSelectedFacility(facilityId);

    // 약간의 지연을 줘서 테두리가 생성된 후 스크롤하도록 함
    setTimeout(() => {
      // 테두리 요소가 생성되었으면 해당 위치로 스크롤
      if (highlightBoxRef.current) {
        // 화면 중앙에 위치하도록 스크롤 위치 계산
        const rect = highlightBoxRef.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset +
          rect.top -
          window.innerHeight / 2 +
          rect.height / 2;

        // 부드럽게 스크롤
        window.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }, 50);
  }, []);

  // 창 크기 변경 시 스케일 계수 재계산
  useEffect(() => {
    window.addEventListener("resize", handleImageLoad);
    return () => {
      window.removeEventListener("resize", handleImageLoad);
    };
  }, [handleImageLoad]);

  return (
    <>
      <Stack minHeight="100%" alignItems="center" py={2} pb={10} gap={5}>
        {/* 건물명 */}
        <Typography
          variant="h2"
          mt="5vh"
          sx={{
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              width: "calc(100% + 40px)",
              height: "5px",
              bottom: "-16px",
              left: "-20px",
              backgroundColor: theme.palette.primary.main,
              borderRadius: "50px",
            },
          }}
        >
          {buildingName}
        </Typography>

        {/* 건물 배치도 */}
        <Container maxWidth="md">
          <Stack alignItems="center" gap={1} position="relative">
            <Stack>
              {/* 건물 배치도 이미지 */}
              <Box
                component="img"
                ref={imageRef} // ref 연결
                src={getBuildingLayoutImage()}
                alt={`${buildingName} 건물 배치도`}
                width="100%"
                onLoad={handleImageLoad} // 이미지 로드 시 핸들러 호출
              />
              {/* 선택된 호실의 테두리 표시 */}
              {selectedFacility && (
                <Box
                  ref={highlightBoxRef}
                  sx={{
                    position: "absolute",
                    border: "3px solid red",
                    borderRadius: "4px",
                    pointerEvents: "none",
                    zIndex: 10,
                    transition: "all 0.3s ease-in-out",
                    ...(() => {
                      const facility = facilities.find(
                        (f) => f.id === selectedFacility
                      );
                      if (!facility || !facility.coordinates) return {};
                      const { leftTop, rightBottom } = facility.coordinates;

                      // 스케일 계수 적용
                      return {
                        top: `${leftTop[1] * scaleFactor}px`,
                        left: `${leftTop[0] * scaleFactor}px`,
                        width: `${
                          (rightBottom[0] - leftTop[0]) * scaleFactor
                        }px`,
                        height: `${
                          (rightBottom[1] - leftTop[1]) * scaleFactor
                        }px`,
                      };
                    })(),
                  }}
                />
              )}
            </Stack>

            {/* 엘리베이터 & 화장실 아이콘 */}
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              {/* 엘리베이터 아이콘 */}
              <Box
                component="img"
                src={ElevatorIcon}
                alt="엘리베이터 아이콘"
                width="10%"
              />
              <Typography variant="h6" fontWeight={500}>
                엘리베이터
              </Typography>

              {/* 구분선 */}
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{
                  mx: 2,
                  borderWidth: 2,
                  borderRadius: "50px",
                  borderColor: theme.palette.primary.main,
                }}
              />

              {/* 화장실 아이콘 */}
              <Box
                component="img"
                src={WcIcon}
                alt="화장실 아이콘"
                width="10%"
              />
              <Typography variant="h6" fontWeight={500}>
                화장실
              </Typography>
            </Stack>
          </Stack>
        </Container>

        <Stack width="300px" gap={3}>
          {/* 층수 선택 버튼 */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              display: "flex",
              height: "56px",
              borderRadius: "8px",
            }}
            ref={floorButtonElement}
            onClick={handleFloorMenuOpen}
          >
            <Typography variant="h5" flex={1}>
              {floor}
            </Typography>
            <ExpandMoreRoundedIcon />
          </Button>

          {/* 층수 선택 메뉴 */}
          <Menu
            id="building-floor-menu"
            anchorEl={floorButtonElement.current}
            open={isFloorMenuOpen}
            onClose={handleFloorMenuClose}
            sx={{
              "& .MuiMenu-paper": {
                width: "300px",
                borderRadius: "8px",
              },
              "& .MuiList-root": {
                padding: 0,
              },
            }}
          >
            {floors[buildingId].map((floor) => (
              <MenuItem
                key={`floor-menu-${floor}`}
                onClick={() => handleFloorChange(floor)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  background: theme.palette.secondary.main,
                  color: "white",
                  "&:hover": {
                    color: "black",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={500}
                  textAlign="center"
                  color="inherit"
                >
                  {floor}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* 호실 입력란 */}
          <Paper elevation={3}>
            <TextField
              variant="outlined"
              placeholder="검색할 호실을 입력하세요."
              fullWidth
              value={keyword}
              onChange={handleKeywordChange}
            />
          </Paper>
        </Stack>

        {/* 호실 정보 표 */}
        <Container maxWidth="lg">
          <TableContainer component={Paper} sx={{ maxHeight: "400px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      background: "#f5f2f3",
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      borderRight: `1px solid ${theme.palette.divider}`,
                      width: {
                        xs: "100px",
                        sm: "150px",
                        md: "200px",
                      },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      호실
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      호실명
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow
                    key={facility.id}
                    onClick={() => handleFacilityClick(facility.id)}
                    sx={{
                      cursor: "pointer",
                      "&:not(:hover) td:first-of-type": {
                        background: "#fcfcfc",
                      },
                      "&:hover": {
                        background: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        borderRight: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {facility.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {facility.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        {/* 표 클릭 안내 문구 */}
        <Paper
          elevation={3}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: "50px",
            background: theme.palette.primary.main,
          }}
        >
          <Stack direction="row" color="white">
            <Typography variant="h6" mr="0.25em">
              클릭
            </Typography>
            <Typography variant="h6" fontWeight={300} mr="0.25em">
              시 해당 호실로
            </Typography>
            <Typography variant="h6">이동</Typography>
            <Typography variant="h6" fontWeight={300}>
              합니다.
            </Typography>
          </Stack>
        </Paper>
      </Stack>
      <Footer />
    </>
  );
};

export default Detail;
