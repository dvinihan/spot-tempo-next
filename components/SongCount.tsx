import { Typography } from "@mui/material";
import { useReloadSavedSongs, useSavedSongsCount } from "../queries/songs";

const SongCount = () => {
  const savedSongsCountQuery = useSavedSongsCount();
  const reloadSavedSongsMutation = useReloadSavedSongs();

  const savedSongsCount =
    reloadSavedSongsMutation.data?.total ?? savedSongsCountQuery.data?.count;

  return (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total saved songs: {savedSongsCount}
    </Typography>
  );
};

export default SongCount;
