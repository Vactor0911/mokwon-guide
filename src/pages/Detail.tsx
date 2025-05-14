import { Box, Grid, Stack } from "@mui/material";
import { useLocation } from "react-router";

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const building = queryParams.get("building");

  return (
    <Stack height="100%" justifyContent="center">
      {building}
      <Stack>
        <Box></Box>
      </Stack>
      <Grid size={6}>temp</Grid>
    </Stack>
  );
};

export default Detail;
