import axios from "axios";
import { SongAction } from "../types/Song";

export const reloadSavedSongs = async (accessTokenCookie?: string) => {
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
