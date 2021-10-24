import { useEffect } from "react";
import { useMutation } from "react-query";
import { ListType } from "../constants";
import { syncWithSpotify } from "../mutationFunctions/songs";
import { getAuthCookies, getIsAccessTokenExpired } from "../util/cookies";
import { useSongCountQuery } from "./useSongCountQuery";

export const useSpotifySync = (
  listType: ListType,
  hasDoneFirstSongLoad: boolean,
  setHasDoneFirstSongLoad: (hasDoneFirstSongLoad: boolean) => void
) => {
  const { accessTokenCookie, expiryTimeCookie } = getAuthCookies();
  const isExpired = getIsAccessTokenExpired(expiryTimeCookie);

  const songCountQuery = useSongCountQuery(listType);

  const syncWithSpotifyMutation = useMutation(
    () => syncWithSpotify({ accessTokenCookie }),
    {
      onSuccess: () => {
        songCountQuery.refetch();
      },
    }
  );
  const reloadMutate = syncWithSpotifyMutation.mutate;

  useEffect(() => {
    if (!hasDoneFirstSongLoad && !isExpired) {
      reloadMutate();
      setHasDoneFirstSongLoad(true);
    }
  }, [hasDoneFirstSongLoad, isExpired, reloadMutate, setHasDoneFirstSongLoad]);

  return { isSpotifySyncing: syncWithSpotifyMutation.isLoading };
};
