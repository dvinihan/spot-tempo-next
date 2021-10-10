import axios from "axios";
import { SongAction } from "../types/Song";

export const getSavedSongsCount = async ({
  accessTokenCookie,
}: {
  accessTokenCookie?: string;
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getSavedSongsCount`,
    { params: { accessToken: accessTokenCookie } }
  );
  return data;
};

export const getMatchingSongs = async ({
  bpm,
  accessTokenCookie,
}: {
  bpm: string;
  accessTokenCookie?: string;
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getMatchingSongs`,
    { params: { bpm, start: 0, end: 100, accessToken: accessTokenCookie } }
  );
  return data?.songs;
};

export const reloadSavedSongs = async ({
  accessTokenCookie,
}: {
  accessTokenCookie?: string;
}) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reload`,
    {
      accessToken: accessTokenCookie,
    }
  );
  return data;
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
