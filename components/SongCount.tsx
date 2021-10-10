import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSavedSongsCount } from "../queries/songs";

const SongCount = () => {
  const savedSongsCountQuery = useSavedSongsCount();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return savedSongsCountQuery.isFetching ? (
    <CircularProgress />
  ) : (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total saved songs: {savedSongsCountQuery.data?.count}
    </Typography>
  );
};

export default SongCount;
