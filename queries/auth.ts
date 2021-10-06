import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useMutation } from "react-query";
import { setAuthCookies } from "../helpers/cookies";

export const useLogin = () => {
  const router = useRouter();

  return useMutation(
    "login",
    async ({ code }: { code: string }) => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
        {
          code,
          redirectUri: process.env.NEXT_PUBLIC_BASE_URL,
        }
      );
      return data;
    },
    {
      onSuccess: ({ accessToken, expiryTime, refreshToken, userId }) => {
        setAuthCookies({ accessToken, expiryTime, refreshToken, userId });
        router.push(process.env.NEXT_PUBLIC_BASE_URL as string);
      },
    }
  );
};

export const useRefresh = () =>
  useMutation(
    "refresh",
    async ({ refreshToken }: { refreshToken: string }) => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh`,
        {
          refreshToken,
        }
      );
      return data;
    },
    {
      onSuccess: ({ accessToken, expiryTime, refreshToken }) => {
        setAuthCookies({ accessToken, expiryTime, refreshToken });
      },
    }
  );
