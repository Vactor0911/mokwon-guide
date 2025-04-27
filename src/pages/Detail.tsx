import { Stack } from "@mui/material";

const Detail = () => {
  const params = window.location.pathname.split("/").slice(2);

  return (
    <Stack height="100vh" justifyContent="center">
      Detail Page! {params[0]}
    </Stack>
  );
};

export default Detail;
