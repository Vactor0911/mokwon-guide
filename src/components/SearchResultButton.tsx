import { Box, Button, ButtonProps, IconButton, Stack } from "@mui/material";
import { getItemUrl } from "../utils";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { grey } from "@mui/material/colors";
import HighLightedText from "./HighlightedText";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useAtom, useSetAtom } from "jotai";
import {
  isSearchDrawerOpenAtom,
  keywordAtom,
  searchHistoryAtom,
  searchResultAtom,
  selectedFacilityAtom,
} from "../states";
import { FacilityInterface } from "../utils/search";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface FacilityItemButtonProps extends ButtonProps {
  item: FacilityInterface;
  keyword?: string;
  deleteBtn?: boolean;
}

const FacilityItemButton = (props: FacilityItemButtonProps) => {
  const { item, keyword = "", deleteBtn, ...others } = props;

  const setIsSearchDrawerOpen = useSetAtom(isSearchDrawerOpenAtom); // 검색 드로어 메뉴 열림림
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); // 검색 기록

  /**
   * 검색 기록을 추가하는 함수
   * @param newItem 건물 및 시설물 데이터 객체
   */
  const addSearchHistory = useCallback(
    (newItem: FacilityInterface) => {
      const itemId = (searchHistory || []).indexOf(newItem.id);

      if (itemId >= 0) {
        const newSearchHistory = [
          searchHistory[itemId],
          ...searchHistory.slice(0, itemId),
          ...searchHistory.slice(itemId + 1, searchHistory.length),
        ];

        setSearchHistory(newSearchHistory.slice(0, 10));
        return;
      }

      if (searchHistory) {
        const newSearchHistory = [newItem.id, ...searchHistory];
        setSearchHistory(newSearchHistory.slice(0, 10));
        return;
      }

      setSearchHistory([newItem.id]);
    },
    [searchHistory, setSearchHistory]
  );

  // 버튼 클릭
  const navigate = useNavigate();
  const setKeyWord = useSetAtom(keywordAtom);
  const setSearchResult = useSetAtom(searchResultAtom);
  const setSelectedFacility = useSetAtom(selectedFacilityAtom);

  const handleButtonClick = useCallback(() => {
    addSearchHistory(item);
    setIsSearchDrawerOpen(false);
    setKeyWord("");
    setSearchResult([]);
    setSelectedFacility(item);

    const url = getItemUrl(item);
    navigate(url);
  }, [
    addSearchHistory,
    item,
    navigate,
    setIsSearchDrawerOpen,
    setKeyWord,
    setSearchResult,
    setSelectedFacility,
  ]);

  // 검색 기록 삭제 버튼 마우스 진입
  const [isRippleDisabled, setIsRippleDisabled] = useState(false);

  const handleRippleDisable = useCallback((newIsRippleDisabled: boolean) => {
    setIsRippleDisabled(newIsRippleDisabled);
  }, []);

  // 검색 기록 삭제 버튼 클릭
  const handleDeleteHistoryButtonClick = useCallback(() => {
    if (!searchHistory) {
      return;
    }

    const newSearchHistory = searchHistory.filter(
      (history) => history !== item.id
    );
    setSearchHistory(newSearchHistory);
  }, [item.id, searchHistory, setSearchHistory]);

  return (
    <Box width="100%" borderBottom="1px solid #d9d9d9" position="relative">
      <Button
        fullWidth
        disableRipple={isRippleDisabled}
        sx={{
          px: 2,
          borderRadius: 0,
          "&:hover div.scroll-text, &:active  div.scroll-text": {
            animation: "movingAnimation 5s linear infinite",
          },
        }}
        onClick={handleButtonClick}
        {...others}
      >
        <Stack
          direction="row"
          gap={2}
          justifyContent="flex-start"
          alignItems="center"
          width="100%"
          overflow="hidden"
        >
          {/* 아이콘 */}
          {item.id.length <= 2 ? (
            <ApartmentRoundedIcon fontSize="large" color="secondary" />
          ) : (
            <LocationOnRoundedIcon fontSize="large" color="secondary" />
          )}

          {/* 텍스트 */}
          <Stack flex={1} overflow="hidden">
            <HighLightedText
              className="scroll-text"
              text={item.name}
              keyword={keyword}
              variant="h6"
              baseColor="black"
            />
            <HighLightedText
              text={item.id}
              keyword={keyword}
              variant="subtitle2"
              baseColor={grey[500]}
            />
          </Stack>
        </Stack>
      </Button>

      {/* 버튼 */}
      {deleteBtn && (
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            right: 2,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
          onMouseEnter={() => handleRippleDisable(true)}
          onMouseLeave={() => handleRippleDisable(false)}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteHistoryButtonClick();
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default FacilityItemButton;
