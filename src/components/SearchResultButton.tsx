import { Button, ButtonProps, Stack } from "@mui/material";
import { getItemUrl, SearchResultInterface } from "../utils";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { grey } from "@mui/material/colors";
import HighLightedText from "./HighlightedText";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { isSearchDrawerOpenAtom } from "../states";

interface SearchResultButtonProps extends ButtonProps {
  item: SearchResultInterface;
  keyword: string;
}

const SearchResultButton = (props: SearchResultButtonProps) => {
  const { item, keyword = "", ...others } = props;

  const setIsSearchDrawerOpen = useSetAtom(isSearchDrawerOpenAtom);

  // 버튼 클릭
  const navigate = useNavigate();
  const handleButtonClick = useCallback(() => {
    const url = getItemUrl(item);
    navigate(url);
    setIsSearchDrawerOpen(false);
  }, [item, navigate, setIsSearchDrawerOpen]);

  return (
    <Button
      sx={{
        px: 2,
        borderBottom: "1px solid #d9d9d9",
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
        {item.id.length <= 2 ? (
          <ApartmentRoundedIcon fontSize="large" color="secondary" />
        ) : (
          <LocationOnRoundedIcon fontSize="large" color="secondary" />
        )}
        <Stack width="100%" overflow="hidden">
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
  );
};

export default SearchResultButton;
