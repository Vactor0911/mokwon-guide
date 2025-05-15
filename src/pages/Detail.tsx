import {
  Stack,
  Box,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useLocation } from "react-router";

const Detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const building = queryParams.get("building");

  return (
    <Stack height="100%">
      <Stack gap={3} my={2}>
        {/* Main image */}
        <Box height={"300px"} mx={5} bgcolor={"#222222"}></Box>

        {/* main title */}
        <Stack textAlign={"center"}>{building}</Stack>

        {/* detail image */}
        <Box height={"300px"} mx={5} bgcolor={"#d9d9d9"}></Box>

        {/* Buttons */}
        <Stack gap={6} mx={10}>
          <Select labelId="demo-simple-select-label" id="demo-simple-select">
            <MenuItem value={1}>1F</MenuItem>
            <MenuItem value={2}>2F</MenuItem>
            <MenuItem value={3}>3F</MenuItem>
          </Select>
          <TextField
            id="filled-search"
            label="호실을 입력해주세요"
            type="search"
            variant="filled"
          />
        </Stack>

        {/* detail content */}
        <Stack></Stack>
      </Stack>
    </Stack>
  );
};

export default Detail;
