import axios from "axios";
import { UseQueryResult } from "react-query";

export const reloadSavedSongs = async (accessToken: string) => {
  const { data } = await axios.post(`${process.env.BASE_URL}/api/reload`, {
    accessToken,
  });
  return data;
};

export const getSavedSongsCount = async (accessToken: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}/api/getSavedSongsCount`,
    { params: { accessToken } }
  );
  return data;
};

export const getMatchingSongs = async (bpm: number, accessToken: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}/api/getMatchingSongs`,
    { params: { bpm, start: 0, end: 100, accessToken } }
  );
  return data;
};

export const addSong = async (
  songUri: string,
  getMatchingSongsQuery: UseQueryResult,
  accessToken: string
) => {
  const { data, status } = await axios.post(
    `${process.env.BASE_URL}/api/addSong`,
    {
      songUri,
      accessToken,
    }
  );
  status === 200 && getMatchingSongsQuery.refetch();
  return data;
};

export const removeSong = async (
  songUri: string,
  getMatchingSongsQuery: UseQueryResult,
  accessToken: string
) => {
  const { data, status } = await axios.delete(
    `${process.env.BASE_URL}/api/removeSong?songUri=${songUri}`,
    {
      data: { accessToken },
    }
  );
  status === 200 && getMatchingSongsQuery.refetch();
  return data;
};
