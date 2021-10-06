import { Button } from "@mui/material";
import { useReloadSavedSongs } from "../queries/songs";

const ReloadButton = () => {
  const reloadSavedSongsMutation = useReloadSavedSongs();

  return (
    <Button
      onClick={() => reloadSavedSongsMutation.mutate()}
      sx={{
        color: "black",
        bgcolor: "lightblue",
        ":hover": {
          bgcolor: "white",
        },
      }}
    >
      Reload saved songs
    </Button>
  );
};

export default ReloadButton;
