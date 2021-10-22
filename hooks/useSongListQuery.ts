import { useQuery } from "react-query";
import { ListType } from "../constants";
import { getSongList } from "../mutationFunctions/songs";
import { getAuthCookies } from "../util/cookies";

export const useSongListQuery = (listType: ListType, bpm?: string) => {
  const { accessTokenCookie } = getAuthCookies();

  return useQuery(
    "getSongList",
    () => getSongList({ bpm, accessTokenCookie, listType }),
    // for SAVED_SONG list, we only want the query to be made on manual request through the "search" button
    {
      enabled: listType !== ListType.SAVED_SONG,
    }
  );
};
