import {
  ButtonBase,
  Paper,
  Stack,
  StackProps,
  Typography,
  useTheme,
} from "@mui/material";
import { getMarkerColor, getMarkerIcon } from "../utils/marker";
import { useAtom } from "jotai";
import { selectedCategoriesAtom } from "../states";
import { useCallback } from "react";

const MarkerSelector = (props: StackProps) => {
  const theme = useTheme();

  const [selectedCategories, setSelectedCategories] = useAtom(
    selectedCategoriesAtom
  );

  // 카테고리 버튼 클릭
  const handleButtonClick = useCallback(
    (category: string) => {
      setSelectedCategories((prev) =>
        prev.map((item) =>
          item.category === category
            ? { ...item, selected: !item.selected }
            : item
        )
      );
    },
    [setSelectedCategories]
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      px="20px"
      gap={1}
      width="100%"
      overflow="scroll"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      sx={{
        "&:hover": {
          cursor: "grab",
        },
        "&:active": {
          cursor: "grabbing",
        },
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      {...props}
    >
      {selectedCategories.map((categoryObj, index) => {
        const MarkerIcon = getMarkerIcon(categoryObj.category);
        return (
          <ButtonBase
            key={`category-select-${index}`}
            sx={{
              borderRadius: "50px",
            }}
            onClick={() => handleButtonClick(categoryObj.category)}
          >
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                borderWidth: 2,
                borderColor: categoryObj.selected
                  ? theme.palette.primary.main
                  : "grey.400",
                p: 1,
                px: 1.5,
                gap: 1,
              }}
            >
              <MarkerIcon
                sx={{
                  color: getMarkerColor(categoryObj.category),
                }}
              />
              <Typography variant="body2" fontWeight={500} whiteSpace="nowrap">
                {categoryObj.category}
              </Typography>
            </Paper>
          </ButtonBase>
        );
      })}
    </Stack>
  );
};

export default MarkerSelector;
