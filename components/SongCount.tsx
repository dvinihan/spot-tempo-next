import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";

const SongCount = () => {
  const { savedSongsCountMutation } = useAppContext();
  const { mutate, isLoading, data } = savedSongsCountMutation;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    mutate();
  }, [mutate]);

  if (!isMounted) {
    return null;
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total saved songs: {data?.count}
    </Typography>
  );
};

export default SongCount;
