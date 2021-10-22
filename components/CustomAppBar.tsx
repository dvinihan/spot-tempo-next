import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavDrawer } from "./NavDrawer";
import { useState } from "react";

export const CustomAppBar = () => {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const openNavDrawer = () => setIsNavDrawerOpen(true);
  const closeNavDrawer = () => setIsNavDrawerOpen(false);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={openNavDrawer} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">SpotTempo</Typography>
        </Toolbar>
      </AppBar>

      <NavDrawer isOpen={isNavDrawerOpen} handleClose={closeNavDrawer} />
    </>
  );
};
