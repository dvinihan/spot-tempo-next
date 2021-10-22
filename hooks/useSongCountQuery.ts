import { useQuery } from "react-query";
import { ListType } from "../constants";
import { getSongCount } from "../mutationFunctions/songs";
import { getAuthCookies, getIsAccessTokenExpired } from "../util/cookies";

export const useSongCountQuery = (listType: ListType) => {
  const { accessTokenCookie, expiryTimeCookie } = getAuthCookies();
  const isExpired = getIsAccessTokenExpired(expiryTimeCookie);

  return useQuery(["getSongCount", isExpired], () =>
    getSongCount({ accessTokenCookie, listType, isExpired })
  );
};
