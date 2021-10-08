import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useMutation } from "react-query";
import { AUTH_LOADING_TEXT } from "../constants";
import { useAppContext } from "../context/appContext";
import { setAuthCookies } from "../helpers/cookies";

export const useLogin = () => {
  const router = useRouter();
  const { setLoadingText } = useAppContext();

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
      onMutate: () => {
        setLoadingText(AUTH_LOADING_TEXT);
      },
      onSettled: () => {
        setLoadingText("");
      },
      onSuccess: ({ accessToken, expiryTime, refreshToken }) => {
        setAuthCookies({ accessToken, expiryTime, refreshToken });
        router.push(process.env.NEXT_PUBLIC_BASE_URL as string);
      },
    }
  );
};

export const useRefresh = () => {
  const { setLoadingText } = useAppContext();

  return useMutation(
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
      onMutate: () => {
        setLoadingText(AUTH_LOADING_TEXT);
      },
      onSettled: () => {
        setLoadingText("");
      },
      onSuccess: ({ accessToken, expiryTime, refreshToken }) => {
        setAuthCookies({ accessToken, expiryTime, refreshToken });
      },
    }
  );
};
