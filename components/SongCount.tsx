import { CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { getAuthCookies, getIsAccessTokenExpired } from "../util/cookies";

const SongCount = () => {
  const { savedSongsCountMutation } = useAppContext();
  const { mutate, isLoading, data } = savedSongsCountMutation;

  const { expiryTimeCookie } = getAuthCookies();
  const isExpired = getIsAccessTokenExpired(expiryTimeCookie);

  useEffect(() => {
    if (!isExpired) {
      mutate();
    }
  }, [mutate, isExpired]);

  if (isLoading || data?.count === undefined) {
    return <CircularProgress />;
  }

  return (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total saved songs: {data?.count}
    </Typography>
  );
};

export default SongCount;
