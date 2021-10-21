import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { Paths } from "../constants";
import { useAppContext } from "../context/appContext";

export const NavDrawer = () => {
  const router = useRouter();

  const { isNavDrawerOpen, setIsNavDrawerOpen } = useAppContext();

  const handleClose = () => setIsNavDrawerOpen(false);

  const handleHomeClick = () => {
    router.push(Paths.HOME);
    handleClose();
  };

  const handleAddedSongsClick = () => {
    router.push(Paths.PLAYLIST_SONGS);
    handleClose();
  };

  const handleDislikedSongsClick = () => {
    router.push(Paths.DISLIKED_SONGS);
    handleClose();
  };

  return (
    <Drawer anchor="left" open={isNavDrawerOpen} onClose={handleClose}>
      <List>
        <ListItemButton
          onClick={handleHomeClick}
          selected={router.pathname === Paths.HOME}
        >
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton
          onClick={handleAddedSongsClick}
          selected={router.pathname === Paths.PLAYLIST_SONGS}
        >
          <ListItemText primary="Added Songs" />
        </ListItemButton>
        <ListItemButton
          onClick={handleDislikedSongsClick}
          selected={router.pathname === Paths.DISLIKED_SONGS}
        >
          <ListItemText primary="Disliked Songs" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};
