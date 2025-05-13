import { Stack } from "@mui/material";
import { useLocation } from "react-router";

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const building = queryParams.get("building");

  return (
    <Stack height="100%" justifyContent="center">
      Detail Page! {building}
      Hello World!
    </Stack>
  );
};

export default Detail;
