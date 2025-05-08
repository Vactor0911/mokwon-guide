import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { theme } from "../theme";
import { ItemType, SearchResult } from "../utils";
import { useCallback } from "react";
import React from "react";

interface SearchResultItemProps {
  result: SearchResult;
  searchData: string;
  onClick: (result: SearchResult) => void;
}

const SearchResultItem = ({
  result,
  searchData,
  onClick,
}: SearchResultItemProps) => {
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

  return (
    <ListItem
      component="div"
      disablePadding
      sx={{
        "&:hover": { backgroundColor: "#f0f0f0" },
      }}
    >
      <ListItemButton onClick={() => onClick(result)}>
        {result.type === ItemType.Building ? (
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
            result.type === ItemType.Building ? "건물" : `시설 (${result.id})`
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

// React.memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
export default React.memo(SearchResultItem);
