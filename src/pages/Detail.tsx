import { Stack, Box, Button } from "@mui/material";
import { useLocation } from "react-router";

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const building = queryParams.get("building");

  return (
    <Stack height="100%" justifyContent="center">
      <Stack spacing={2}>
        <Box>건물 이미지</Box>
        {building}
        <Box>건물 상세 이미지</Box>
        <Button>1F</Button>
      </Stack>
    </Stack>
  );
};

export default Detail;
