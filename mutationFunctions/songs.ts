import axios from "axios";
import { ListType, SongAction } from "../constants";

export const getSongCount = async ({
  accessTokenCookie,
  listType,
  isExpired,
}: {
  accessTokenCookie?: string;
  listType: ListType;
  isExpired: boolean;
}) => {
  if (!accessTokenCookie || isExpired) {
    return;
  }

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getSongCount`,
    { params: { accessToken: accessTokenCookie, listType } }
  );
  return data;
};

export const getSongList = async ({
  bpm,
  accessTokenCookie,
  listType,
}: {
  bpm?: string;
  accessTokenCookie?: string;
  listType: ListType;
}) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getSongList`,
    {
      params: {
        bpm,
        start: 0,
        end: 100,
        accessToken: accessTokenCookie,
        listType,
      },
    }
  );
  return data?.songs;
};

export const reloadFromSpotify = async ({
  accessTokenCookie,
}: {
  accessTokenCookie?: string;
}) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reloadFromSpotify`,
    {
      accessToken: accessTokenCookie,
    }
  );
  return data;
};

export const modifySong = async ({
  songUri,
  accessTokenCookie,
  action,
}: {
  songUri: string;
  accessTokenCookie?: string;
  action: SongAction;
}) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/modifySong`,
    {
      songUri,
      accessToken: accessTokenCookie,
      action,
    }
  );
  return data;
};
