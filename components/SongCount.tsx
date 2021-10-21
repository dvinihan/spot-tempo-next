import { CircularProgress, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { ListType } from "../constants";
import { getSongCount } from "../mutationFunctions/songs";
import { getAuthCookies, getIsAccessTokenExpired } from "../util/cookies";

type Props = {
  listType: ListType;
};

const SongCount = ({ listType }: Props) => {
  const { accessTokenCookie, expiryTimeCookie } = getAuthCookies();
  const isExpired = getIsAccessTokenExpired(expiryTimeCookie);

  const { isLoading, data } = useQuery([`getSongCount`, isExpired], () =>
    getSongCount({ accessTokenCookie, listType, isExpired })
  );

  if (isLoading || data?.count === undefined) {
    return <CircularProgress />;
  }

  return (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total {listType.toLowerCase()} songs: {data?.count}
    </Typography>
  );
};

export default SongCount;
