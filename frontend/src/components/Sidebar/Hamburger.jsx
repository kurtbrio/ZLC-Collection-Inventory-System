import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Box, Drawer, Button } from "@mui/material";
import { Menu } from "@mui/icons-material";

const Hamburger = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (openState) => () => {
    setOpen(openState);
  };

  return (
    <Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Sidebar />
      </Drawer>

      <Button onClick={toggleDrawer(true)}>
        <Menu sx={{ color: "black" }} />
      </Button>
    </Box>
  );
};

export default Hamburger;
