import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../context/appContext";

export const useReloadSavedSongs = () => {
  const { accessToken } = useAppContext();

  return useMutation("reloadSavedSongs", async () => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/reload`,
      {
        accessToken,
      }
    );
    return data;
  });
};

export const useSavedSongsCount = () => {
  const { accessToken } = useAppContext();

  return useQuery(
    ["getSavedSongsCount", accessToken],
    async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getSavedSongsCount`,
        { params: { accessToken } }
      );
      return data;
    },
    { enabled: Boolean(accessToken) }
  );
};

export const useMatchingSongs = () => {
  const { accessToken, bpm } = useAppContext();

  return useQuery(
    "getMatchingSongs",
    async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getMatchingSongs`,
        { params: { bpm, start: 0, end: 100, accessToken } }
      );
      return data?.songs;
    },
    // rely only on manual freshes
    { enabled: false }
  );
};

export const useAddSong = () => {
  const { accessToken } = useAppContext();

  const getMatchingSongsQuery = useMatchingSongs();

  return useMutation(
    async ({ songUri }: { songUri: string }) => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/addSong`,
        {
          songUri,
          accessToken,
        }
      );
      return data;
    },
    {
      onSuccess: () => {
        getMatchingSongsQuery.refetch();
      },
    }
  );
};

export const useRemoveSong = () => {
  const { accessToken } = useAppContext();

  const getMatchingSongsQuery = useMatchingSongs();

  return useMutation(
    async ({ songUri }: { songUri: string }) => {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/removeSong`,
        {
          data: { accessToken },
          params: { songUri },
        }
      );
      return data;
    },
    {
      onSuccess: () => {
        getMatchingSongsQuery.refetch();
      },
    }
  );
};
