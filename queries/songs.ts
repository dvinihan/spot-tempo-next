import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { SAVED_SONGS_LOADING_TEXT } from "../constants";
import { useAppContext } from "../context/appContext";
import { getAuthCookies } from "../util/cookies";

export const useReloadSavedSongs = () => {
  const { accessTokenCookie } = getAuthCookies();
  const { setLoadingText } = useAppContext();
  const savedSongsCountQuery = useSavedSongsCount();

  return useMutation(
    "reloadSavedSongs",
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

export const useAddSong = () => {
  const { accessTokenCookie } = getAuthCookies();

  return useMutation(async ({ songUri }: { songUri: string }) => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/addSong`,
      {
        songUri,
        accessToken: accessTokenCookie,
      }
    );
    return data;
  });
};

export const useRemoveSong = () => {
  const { accessTokenCookie } = getAuthCookies();

  return useMutation(async ({ songUri }: { songUri: string }) => {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/removeSong`,
      {
        data: { accessToken: accessTokenCookie },
        params: { songUri },
      }
    );
    return data;
  });
};
