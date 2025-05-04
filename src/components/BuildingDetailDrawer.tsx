import { Box, SwipeableDrawer, Typography } from "@mui/material";
import { useCallback, useState } from "react";

const BuildingDetailDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleToggleDrawer = useCallback((newOpen: boolean) => {
    setIsDrawerOpen(newOpen);
  }, []);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isDrawerOpen}
      onOpen={() => handleToggleDrawer(true)}
      onClose={() => handleToggleDrawer(false)}
      swipeAreaWidth={50}
      keepMounted
    >
      <Box>
        <Typography variant="h1">Hello World</Typography>
      </Box>
    </SwipeableDrawer>
  );
};

export default BuildingDetailDrawer;
