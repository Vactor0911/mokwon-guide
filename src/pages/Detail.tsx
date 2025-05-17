import {
  Stack,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import { theme } from "../theme";
import buildings from "../assets/buildings.json";
import facilities from "../assets/facilities.json";

interface Facility {
  id: string;
  name: string;
}

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const buildingId = queryParams.get("building");

  const [searchRoom, setSearchRoom] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [maxFloor, setMaxFloor] = useState<number>(1);
  const [titleWidth, setTitleWidth] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);

  // 건물 정보 찾기
  const buildingInfo = buildings.find((b) => b.id === buildingId);
  const buildingName = buildingInfo ? buildingInfo.name : "";

  // 건물별 최대 층수 계산
  useEffect(() => {
    if (!buildingId) return;

    const buildingFloors = facilities
      .filter((facility) => facility.id.startsWith(buildingId))
      .map((facility) => {
        const floorNumber = parseInt(facility.id.slice(1, 2));
        return isNaN(floorNumber) ? 0 : floorNumber;
      });

    const max = Math.max(...buildingFloors, 1);
    setMaxFloor(max);
    setSelectedFloor(1); // 건물 변경시 1층으로 초기화
  }, [buildingId]);

  // ID와 이름 결합하여 표시 형식 만들기
  const displayName = buildingId
    ? `${buildingId} ${buildingName}`
    : "건물 정보 없음";

  useEffect(() => {
    if (titleRef.current) {
      setTitleWidth(titleRef.current.offsetWidth);
    }
  }, [displayName]);

  // 층, 검색어, 건물 변경 시 필터링
  useEffect(() => {
    if (!buildingId) return;

    if (searchRoom === "") {
      // 검색어가 비어있으면 현재 선택된 층의 시설만 표시
      const floorFacilities = facilities.filter((facility) => {
        if (!facility.id.startsWith(buildingId)) return false;
        const floorNumber = parseInt(facility.id.slice(1, 2));
        return floorNumber === selectedFloor;
      });
      setFilteredFacilities(floorFacilities);
    } else {
      // 검색어가 있으면 호실 번호나 이름으로 검색
      const searchResults = facilities.filter((facility) => {
        if (!facility.id.startsWith(buildingId)) return false;

        // 호실 번호로 검색 (예: "101" 검색 시 "A101" 매칭)
        const roomNumber = facility.id.slice(1).replace(/B$/, "");
        const matchesRoomNumber = roomNumber.includes(searchRoom);

        // 이름으로 검색
        const matchesName = facility.name.includes(searchRoom);

        return matchesRoomNumber || matchesName;
      });
      setFilteredFacilities(searchResults);
    }
  }, [buildingId, selectedFloor, searchRoom]);

  // 시설 항목 클릭 핸들러
  const handleFacilityClick = (facility: Facility) => {
    const roomNumber = facility.id.replace(new RegExp(`^${buildingId}`), "");
    // 내비게이션 구현
    console.log(`Navigate to: building=${buildingId}&facilities=${roomNumber}`);
  };

  return (
    <Stack height="100%">
      <Stack gap={6} mt={8}>
        {/* 이미지 */}
        <Box
          component="img"
          src="/images/building_images/n_1.jpg"
          alt=""
          width="100%"
        />

        {/* 메인 타이틀 */}
        <Stack textAlign="center">
          <Typography variant="h4" fontWeight="bold">
            {displayName}
          </Typography>
          <Box
            sx={{
              width: `${displayName.length * 25}px`,
              height: 4,
              mx: "auto",
              mt: 1,
              bgcolor: "error.main",
              borderRadius: 2,
            }}
          />
        </Stack>

        {/* 상세 이미지 */}
        <Box
          sx={{
            mx: 5,
            height: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {buildingId && (
            <Box
              component="img"
              src={`/images/building_layouts/${buildingId.toLowerCase()}_${selectedFloor}.jpg`}
              alt={`${buildingName} ${selectedFloor}층 도면`}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>

        {/* 층 선택 및 검색 */}
        <Stack gap={2} mx={10}>
          <Select
            labelId="floor-select-label"
            id="floor-select"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
          >
            {Array.from({ length: maxFloor }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}F
              </MenuItem>
            ))}
          </Select>

          {/* 층 검색 */}
          <Box sx={{ width: "100%", mx: "auto", mt: 2 }}>
            <TextField
              placeholder="호실 번호를 입력해주세요."
              variant="outlined"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 10,
                textAlign: "center",
                input: {
                  textAlign: "center",
                  fontSize: "15px",
                },
              }}
            />
          </Box>
        </Stack>

        {/* 시설 목록 테이블 (스크롤 가능 영역) */}
        <Box sx={{ mx: 5, height: "300px", overflow: "auto" }}>
          <TableContainer component={Paper} elevation={1}>
            <Table stickyHeader aria-label="시설 테이블">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                    호실
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>호실명</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFacilities.map((facility) => {
                  const roomNumber = facility.id.replace(
                    new RegExp(`^${buildingId}`),
                    ""
                  );
                  return (
                    <TableRow
                      key={facility.id}
                      hover
                      onClick={() => handleFacilityClick(facility)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {facility.id.replace(/B$/, "")}
                      </TableCell>
                      <TableCell>{facility.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 이동 버튼 */}
        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              borderRadius: 8,
              background: theme.palette.primary.main,
              "&:hover": {
                background: theme.palette.primary.main,
              },
            }}
          >
            클릭 시 해당 호실로 이동합니다.
          </Button>
        </Box>

        {/* 푸터 */}
        <Box>
          <Footer />
        </Box>
      </Stack>
    </Stack>
  );
};

export default Detail;
