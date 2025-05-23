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
import { getFacilityFloor } from "../utils";

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const buildingId = queryParams.get("building") || "D";
  const building = buildings.find((building) => building.id === buildingId);
  const facilityId = queryParams.get("facility");

  const [buildingName, setBuildingName] = useState(""); // 건물명 상태
  const floors = useAtomValue(buildingFloorsAtom); // 층수 상태
  const [floor, setFloor] = useState("1F"); // 건물 배치도 층수 상태
  const floorButtonElement = useRef<HTMLButtonElement>(null); // 층수 선택 버튼
  const [isFloorMenuOpen, setIsFloorMenuOpen] = useState(false); // 층수 선택 메뉴 상태
  const [facilities, setFacilities] = useState<FacilityInterface[]>([]); // 시설 정보 상태
  const [keyword, setKeyword] = useState(""); // 검색어 상태

  // 페이지 쿼리 파라미터 변경시 시설 정보 재검색
  useEffect(() => {
    setFloor(facilityId ? getFacilityFloor(facilityId) : "1F"); // 층수 초기화
    setKeyword(""); // 검색어 초기화
    setBuildingName(`${building?.id} ${building?.name}`);

    const newFacilities = findFacilitiesByFloor(buildingId, "1F");
    setFacilities(newFacilities);
  }, [building?.id, building?.name, buildingId, facilityId, location]);

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
  const getBuildingLayoutImage = () => {
    const imageUrl = `./images/building_layouts/${buildingId.toLowerCase()}_${floor
      .replace("F", "")
      .toLowerCase()}.jpg`;
    return imageUrl;
  };

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
          <Stack alignItems="center" gap={1}>
            <Stack>
              {/* 건물 배치도 이미지 */}
              <Box
                component="img"
                src={getBuildingLayoutImage()}
                alt={`${buildingName} 건물 배치도`}
                width="100%"
              />
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
