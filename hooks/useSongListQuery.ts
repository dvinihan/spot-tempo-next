import { useQuery } from "react-query";
import { ListType } from "../constants";
import { getSongList } from "../mutationFunctions/songs";
import { getAuthCookies } from "../util/cookies";

export const useSongListQuery = (listType: ListType, searchTerm?: string) => {
  const { accessTokenCookie } = getAuthCookies();

  return useQuery("getSongList", () =>
    getSongList({ accessTokenCookie, listType, searchTerm })
  );
};
