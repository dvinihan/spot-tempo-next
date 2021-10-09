import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { SAVED_SONGS_LOADING_TEXT } from "../constants";
import { useAppContext } from "../context/appContext";
import { SongAction } from "../types/Song";
import { getAuthCookies } from "../util/cookies";

export const useReloadSavedSongs = () => {
  const { accessTokenCookie } = getAuthCookies();
  const { setLoadingText } = useAppContext();
  const savedSongsCountQuery = useSavedSongsCount();

  return useMutation(
    async () => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reload`,
        {
          accessToken: accessTokenCookie,
        }
      );
      return data;
    },
    {
      onMutate: () => {
        setLoadingText(SAVED_SONGS_LOADING_TEXT);
      },
      onSettled: () => {
        setLoadingText("");
      },
      onSuccess: () => {
        savedSongsCountQuery.refetch();
      },
    }
  );
};

export const useSavedSongsCount = () => {
  const { accessTokenCookie } = getAuthCookies();

  return useQuery(
    "getSavedSongsCount",
    async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getSavedSongsCount`,
        { params: { accessToken: accessTokenCookie } }
      );
      return data;
    },
    { enabled: Boolean(accessTokenCookie) }
  );
};

export const useMatchingSongs = () => {
  const { accessTokenCookie } = getAuthCookies();
  const { bpm, setLoadingText } = useAppContext();

  return useQuery(
    "getMatchingSongs",
    async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getMatchingSongs`,
        { params: { bpm, start: 0, end: 100, accessToken: accessTokenCookie } }
      );
      return data?.songs;
    },
    // rely only on manual freshes
    {
      enabled: false,
      onSettled: () => {
        setLoadingText("");
      },
    }
  );
};

export const addOrRemoveSong = async ({
  songUri,
  accessTokenCookie,
  action,
}: {
  songUri: string;
  accessTokenCookie?: string;
  action: SongAction;
}) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/addOrRemoveSong`,
    {
      songUri,
      accessToken: accessTokenCookie,
      action,
    }
  );
  return data;
};
