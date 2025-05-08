import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { theme } from "../theme";
import { encryptedStorage, removeFromSearchHistory } from "../utils";
import buildings from "../assets/buildings.json";
import buildingLayouts from "../assets/building_layouts.json";

interface SearchHistoryProps {
  searchHistory: string[];
  setSearchHistory: (history: string[]) => void;
  onItemClick: (item: string) => void;
}

const SearchHistory = ({
  searchHistory,
  setSearchHistory,
  onItemClick,
}: SearchHistoryProps) => {
  // 전체 검색 기록 지우기
  const handleClearHistory = () => {
    setSearchHistory([]);
    // 로컬 스토리지에서도 검색 기록 삭제
    encryptedStorage.removeItem("mokwon-search-history");
  };

  // 특정 검색 기록 항목 삭제 함수
  const handleDeleteHistoryItem = (index: number, event: React.MouseEvent) => {
    // 이벤트 버블링 방지
    event.stopPropagation();

    // 항목 제거
    const updatedHistory = removeFromSearchHistory(searchHistory, index);

    // 상태 업데이트
    setSearchHistory(updatedHistory);

    // 로컬 스토리지 업데이트
    encryptedStorage.setItem("mokwon-search-history", updatedHistory);
  };

  if (searchHistory.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ color: "gray" }}>
        최근 검색 기록이 없습니다.
      </Typography>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ borderRadius: 2 }}>
        <List>
          {searchHistory.map((item, index) => {
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
                  onClick={() => onItemClick(item)}
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

      <Stack direction="row" justifyContent="flex-end">
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
      </Stack>
    </Box>
  );
};

export default SearchHistory;
