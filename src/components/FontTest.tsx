import { Typography } from "@mui/material";
import { getSampleText } from "../utils";

const FontTest = () => {
  return Array.from({ length: 9 }).map((_, index) => (
    <Typography
      key={index}
      variant="h1"
      fontWeight={(index + 1) * 100}
      fontSize={"5rem"}
    >
      {getSampleText(index)}
    </Typography>
  ));
};

export default FontTest;
