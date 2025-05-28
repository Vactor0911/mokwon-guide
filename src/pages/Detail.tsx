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
import { useSearchParams } from "react-router";
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
import { useAtom, useAtomValue } from "jotai";
import { buildingFloorsAtom, selectedFacilityAtom } from "../states";
import facilities from "../assets/facilities.json";
import buildings from "../assets/buildings.json";
import { getBuildingLayoutImageUrl, getFacilityFloor } from "../utils";
import BuildingLayoutViewer from "../components/BuildingLayoutViewer";

const Detail = () => {
  const [queryParams] = useSearchParams(); // URL 쿼리 파라미터

  const [buildingId, setBuildingId] = useState(
    queryParams.get("building") || "A"
  ); // 건물 ID
  const [building, setBuilding] = useState(
    buildings.find((building) => building.id === buildingId)
  ); // 건물 객체

  const floors = useAtomValue(buildingFloorsAtom); // 전체 건물 층수 데이터
  const [floor, setFloor] = useState("1F"); // 건물 배치도 층수 상태
  const floorButtonElement = useRef<HTMLButtonElement>(null); // 층수 선택 버튼
  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false); // 층수 선택 메뉴 상태
  const [searchedFacilitiesByFloor, setSearchedFacilitiesByFloor] = useState<
    FacilityInterface[]
  >([]); // 층수에 해당하는 시설 정보 상태
  const [searchedFacilitiesByKeyword, setSearchedFacilitiesByKeyword] =
    useState<FacilityInterface[]>([]); // 검색어로 검색된 시설 정보 상태
  const [keyword, setKeyword] = useState(""); // 검색어 상태
  const [selectedFacility, setSelectedFacility] = useAtom(selectedFacilityAtom); // 선택된 시설 상태
  const facilityButtonElement = useRef<
    Record<string, SVGPolygonElement | null>
  >({});
  const facilityItemElement = useRef<
    Record<string, HTMLTableRowElement | null>
  >({});

  
  console.log(selectedFacility?.id);

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
      setIsFloorMenuOpen(false); // 층수 선택 메뉴 닫기
      setFloor(newFloor); // 층수 상태 업데이트
      setSelectedFacility(null); // 선택된 시설 초기화
      setKeyword(""); // 검색어 초기화

      // 선택한 층수에 해당하는 시설 정보 필터링
      const newFacilities = findFacilitiesByFloor(buildingId, newFloor);
      setSearchedFacilitiesByFloor(newFacilities);
      setSearchedFacilitiesByKeyword(newFacilities);
    },
    [buildingId, setSelectedFacility]
  );

  // 호실 검색
  const searchFacilities = useCallback(
    (keyword: string) => {
      // 검색어에 해당하는 시설 정보 필터링
      if (keyword.trim() === "") {
        // 검색어가 없다면 종료
        setSearchedFacilitiesByKeyword(
          findFacilitiesByFloor(buildingId, floor)
        );
        return;
      }
      const newFacilities = searchByKeyword(keyword, 999, buildingId);

      if (newFacilities.length === 0) {
        setSearchedFacilitiesByKeyword([
          { id: "", name: "검색 결과가 없습니다." },
        ]);
        return;
      }
      setSearchedFacilitiesByKeyword(newFacilities);
    },
    [buildingId, floor]
  );

  // 호실 검색어 변경
  const handleKeywordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newKeyword = event.target.value;
      setKeyword(newKeyword);
      searchFacilities(newKeyword);
    },
    [searchFacilities]
  );

  // 호실 정보 표 스크롤 이동
  const moveTableToCenter = useCallback((facility: FacilityInterface) => {
    const facilityItem = facilityItemElement.current[facility.id];
    const container = facilityItem?.closest(
      ".MuiTableContainer-root"
    ) as HTMLElement;
    if (container && facilityItem) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = facilityItem.getBoundingClientRect();
      const currentScrollTop = container.scrollTop;
      const offset = itemRect.top - containerRect.top;
      const newScrollTop =
        currentScrollTop +
        offset -
        containerRect.height / 2 +
        itemRect.height / 2;
      container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
  }, []);

  // 호실 정보 표 항목 클릭
  const handleFacilityItemClick = useCallback(
    (facility: FacilityInterface) => {
      setTimeout(() => {
        setKeyword(""); // 검색어 초기화
        searchFacilities(""); // 검색 초기화
        setFloor(getFacilityFloor(facility.id)); // 선택된 시설의 층수로 업데이트
        setSelectedFacility(facility); // 선택된 시설 상태 업데이트

        // 해당 시설 버튼으로 스크롤 이동
        const facilityButton = facilityButtonElement.current[facility.id];
        facilityButton?.scrollIntoView({ behavior: "smooth", block: "center" });

        // 표 스크롤이 중심으로 이동
        moveTableToCenter(facility);
      }, 1);
    },
    [moveTableToCenter, searchFacilities, setSelectedFacility]
  );

  // URL 쿼리 파라미터 변경 시 건물 및 시설 정보 업데이트
  useEffect(() => {
    const newBuildingId = queryParams.get("building") || "A";
    const newFacilityId = queryParams.get("facility");

    setBuildingId(newBuildingId); // 건물 ID
    setBuilding(buildings.find((building) => building.id === newBuildingId)); // 건물 객체

    let newFloor = "1F";
    if (newFacilityId) {
      newFloor = getFacilityFloor(newFacilityId); // 층
      setSearchedFacilitiesByFloor(
        findFacilitiesByFloor(newBuildingId, newFloor)
      ); // 해당 층의 시설 정보 업데이트

      const newSelectedFacility = facilities.find(
        (facility) => facility.id === newFacilityId
      );
      if (newSelectedFacility) {
        setSelectedFacility(newSelectedFacility); // 선택된 시설 객체

        setTimeout(() => {
          // 해당 시설 버튼으로 스크롤 이동
          const facilityButton =
            facilityButtonElement.current[newSelectedFacility.id];
          facilityButton?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          moveTableToCenter(newSelectedFacility); // 표 스크롤이 중심으로 이동
        }, 500);
      }
    }

    setKeyword(""); // 검색어 초기화
    setFloor(newFloor);

    // 검색 초기화
    const newSearchedFacilities = findFacilitiesByFloor(
      newBuildingId,
      newFloor
    );
    setSearchedFacilitiesByFloor(newSearchedFacilities);
    setSearchedFacilitiesByKeyword(newSearchedFacilities);
  }, [moveTableToCenter, queryParams, setSelectedFacility]);

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
          {`${building?.id} ${building?.name}`}
        </Typography>

        {/* 건물 배치도 */}
        <Container maxWidth="md">
          <Stack alignItems="center" gap={1}>
            {/* 건물 배치도 이미지 */}
            <BuildingLayoutViewer
              imageUrl={getBuildingLayoutImageUrl(buildingId, floor)}
              facilities={searchedFacilitiesByFloor}
              facilityButtonsRef={facilityButtonElement}
              facilityItemsRef={facilityItemElement}
            />

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
            {floors[buildingId]
              .slice()
              .sort((a, b) => a.length - b.length || a.localeCompare(b))
              .map((floor) => (
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
                {searchedFacilitiesByKeyword.map((facility) => (
                  <TableRow
                    key={facility.id}
                    ref={(elem: HTMLTableRowElement | null) => {
                      facilityItemElement.current[facility.id] = elem;
                    }}
                    sx={{
                      cursor: "pointer",
                      background:
                        selectedFacility?.id === facility.id
                          ? theme.palette.primary.main
                          : "transparent",
                      "&:not(:hover) td:first-of-type": {
                        background:
                          selectedFacility?.id === facility.id
                            ? theme.palette.primary.main
                            : "#fcfcfc",
                      },
                      "&:hover": {
                        background:
                          selectedFacility?.id === facility.id
                            ? theme.palette.primary.main
                            : "#f5f5f5",
                      },
                    }}
                    onClick={() => handleFacilityItemClick(facility)}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        borderRight: `1px solid ${theme.palette.divider}`,
                        color:
                          selectedFacility?.id === facility.id
                            ? "white"
                            : "inherit",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color="inherit"
                      >
                        {facility.id}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          selectedFacility?.id === facility.id
                            ? "white"
                            : "inherit",
                      }}
                    >
                      <Typography variant="subtitle2" color="inherit">
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
