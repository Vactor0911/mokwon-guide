import { Typography } from "@mui/material";
import { getSampleText } from "../utils";

const FontTest = () => {
  return Array.from({ length: 9 }).map((_, index) => (
    <Typography
      key={index}
      variant="h3"
      fontWeight={(index + 1) * 100}
    >
      {getSampleText(index)}
    </Typography>
  ));
};

export default FontTest;
