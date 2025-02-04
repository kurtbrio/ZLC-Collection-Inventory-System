import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { Menu } from "@mui/icons-material";

const Hamburger = () => {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width:1024px)");

  const toggleDrawer = (openState) => () => {
    setOpen(openState);
  };

  return (
    <div>
      {isDesktop ? (
        <Sidebar />
      ) : (
        <div>
          <Box className="block">
            <Drawer open={open} onClose={toggleDrawer(false)}>
              <Sidebar />
            </Drawer>

            <div className="flex pl-3 py-2">
              <button onClick={toggleDrawer(true)}>
                <Menu sx={{ color: "#f1f1f1" }} />
              </button>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Hamburger;
