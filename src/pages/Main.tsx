import { Button, Stack } from "@mui/material";
import FontTest from "../components/FontTest";

const Main = () => {
  return (
    <Stack gap={1}>
      <Button variant="contained" color="primary">
        Primary Button
      </Button>

      <Button variant="contained" color="secondary">
        Primary Button
      </Button>

      <FontTest />
    </Stack>
  );
};

export default Main;
