import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { Path } from "../constants";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const NavDrawer = ({ isOpen, handleClose }: Props) => {
  const router = useRouter();

  const handleNav = (path: Path) => {
    router.push(path);
    handleClose();
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={handleClose}>
      <List>
        <ListItemButton
          onClick={() => handleNav(Path.HOME)}
          selected={router.pathname === Path.HOME}
        >
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleNav(Path.PLAYLIST_SONGS)}
          selected={router.pathname === Path.PLAYLIST_SONGS}
        >
          <ListItemText primary="Added Songs" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleNav(Path.DISLIKED_SONGS)}
          selected={router.pathname === Path.DISLIKED_SONGS}
        >
          <ListItemText primary="Disliked Songs" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};
