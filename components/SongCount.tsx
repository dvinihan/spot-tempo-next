import { CircularProgress, Typography } from "@mui/material";
import { useSavedSongsCount } from "../queries/songs";

const SongCount = () => {
  const savedSongsCountQuery = useSavedSongsCount();

  return savedSongsCountQuery.isLoading ? (
    <CircularProgress />
  ) : (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total saved songs: {savedSongsCountQuery.data?.count}
    </Typography>
  );
};

export default SongCount;
