import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppContext } from "../context/appContext";
import { NavDrawer } from "./NavDrawer";

export const CustomAppBar = () => {
  const { isNavDrawerOpen, setIsNavDrawerOpen } = useAppContext();

  const handleDrawerOpen = () => {
    setIsNavDrawerOpen(true);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">SpotTempo</Typography>
        </Toolbar>
      </AppBar>

      <NavDrawer />
    </>
  );
};
