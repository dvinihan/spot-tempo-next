import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSavedSongsCount } from "../queries/songs";

const SongCount = () => {
  const { refetch, isFetching, data } = useSavedSongsCount();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    refetch();
  }, [refetch]);

  if (!isMounted) {
    return null;
  }

  return isFetching ? (
    <CircularProgress />
  ) : (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total saved songs: {data?.count}
    </Typography>
  );
};

export default SongCount;
