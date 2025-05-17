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
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { theme } from "../theme";
import buildings from "../assets/buildings.json";
import facilities from "../assets/facilities.json";

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const buildingId = queryParams.get("building");
  const facilityId = queryParams.get("facilities");

  const [searchRoom, setSearchRoom] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [filteredFacilities, setFilteredFacilities] = useState([]);

  // 건물 정보 찾기
  const buildingInfo = buildings.find((b) => b.id === buildingId);
  const buildingName = buildingInfo ? buildingInfo.name : "";

  // ID와 이름 결합하여 표시 형식 만들기
  const displayName = buildingId
    ? `${buildingId} ${buildingName}`
    : "건물 정보 없음";

  // 현재 건물 및 층에 맞는 시설 필터링
  useEffect(() => {
    if (!buildingId) return;

    const floorFacilities = facilities.filter((facility) => {
      // 현재 건물에 속하는지 확인
      if (!facility.id.startsWith(buildingId)) return false;

      // 시설 ID에서 층 번호 추출
      const floorMatch = facility.id.match(/^[A-Z]+(\d)/);
      const facilityFloor = floorMatch ? parseInt(floorMatch[1], 10) : null;

      return facilityFloor === selectedFloor;
    });

    setFilteredFacilities(floorFacilities);
  }, [buildingId, selectedFloor]);

  // 시설 항목 클릭 핸들러
  const handleFacilityClick = (facility) => {
    // 호실 번호 추출
    const roomNumber = facility.id.replace(new RegExp(`^${buildingId}`), "");
    // 여기서 내비게이션 구현
    console.log(`Navigate to: building=${buildingId}&facilities=${roomNumber}`);
  };

  return (
    <Stack height="100%">
      <Stack gap={3} my={2}>
        {/* 메인 이미지 */}
        <Box height={"300px"} mx={5} bgcolor={theme.palette.info.main}>
          건물 이미지
        </Box>

        {/* 메인 타이틀 */}
        <Stack textAlign="center">
          <Typography variant="h4" fontWeight="bold">
            {displayName}
          </Typography>
          <Box
            sx={{
              width: `${displayName.length * 20}px`, // 텍스트 길이에 맞게 조정
              height: 4,
              mx: "auto",
              mt: 1,
              bgcolor: "error.main", // 빨간색 테마 사용
              borderRadius: 2,
            }}
          />
        </Stack>

        {/* 상세 이미지 */}
        <Box height={"200px"} mx={5} bgcolor={theme.palette.info.main}>
          건물 상세 이미지
        </Box>

        {/* 층 선택 및 검색 */}
        <Stack gap={6} mx={10}>
          <Select
            labelId="floor-select-label"
            id="floor-select"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
          >
            <MenuItem value={1}>1F</MenuItem>
            <MenuItem value={2}>2F</MenuItem>
            <MenuItem value={3}>3F</MenuItem>
            <MenuItem value={4}>4F</MenuItem>
            <MenuItem value={5}>5F</MenuItem>
          </Select>

          <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 2 }}>
            <TextField
              placeholder="호실을 입력해주세요."
              variant="outlined"
              value={searchRoom}
              onChange={(e) => {
                setSearchRoom(e.target.value);
                if (e.target.value === "") {
                  // 검색어가 비어있으면 기본 층별 시설로 돌아감
                  const defaultFacilities = facilities.filter((facility) => {
                    if (!facility.id.startsWith(buildingId)) return false;
                    const floorMatch = facility.id.match(/^[A-Z]+(\d)/);
                    const facilityFloor = floorMatch
                      ? parseInt(floorMatch[1], 10)
                      : null;
                    return facilityFloor === selectedFloor;
                  });
                  setFilteredFacilities(defaultFacilities);
                } else {
                  // 입력 즉시 검색 실행 (검색 버튼 불필요)
                  const searchResults = facilities.filter(
                    (f) =>
                      f.id.startsWith(buildingId) &&
                      f.id.includes(e.target.value)
                  );
                  setFilteredFacilities(searchResults);
                }
              }}
              sx={{
                width: "100%",
                maxWidth: 400,
                mx: "auto",
                mt: 2,
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
                        {roomNumber}
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
              backgroundColor: "rgba(175, 0, 42, 0.85)",
              "&:hover": {
                backgroundColor: "rgba(175, 0, 42, 1)",
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
