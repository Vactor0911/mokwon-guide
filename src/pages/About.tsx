import { Stack } from "@mui/material";
import { useSetAtom } from "jotai";
import { selectedFacilityAtom } from "../states";
import { useEffect } from "react";

const About = () => {
  const setSelectedFacility = useSetAtom(selectedFacilityAtom); // 선택된 시설 상태

  // 선택된 시설 초기화
  useEffect(() => {
    setSelectedFacility(null);
  }, [setSelectedFacility]);

  return (
    <Stack height="100%" justifyContent="center">
      About Page!
    </Stack>
  );
};

export default About;
