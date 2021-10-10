import axios from "axios";
import { useQuery } from "react-query";
import { getAuthCookies } from "../util/cookies";

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
    // rely only on manual freshes
    { enabled: false }
  );
};

export const useMatchingSongs = (bpm?: string) => {
  const { accessTokenCookie } = getAuthCookies();

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
    }
  );
};
