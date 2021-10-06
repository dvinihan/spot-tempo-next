import axios from "axios";
import { useMutation } from "react-query";

export const useLogin = () =>
  useMutation("login", async ({ code }: { code: string }) => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
      {
        code,
        redirectUri: process.env.NEXT_PUBLIC_BASE_URL,
      }
    );
    return data;
  });

export const useRefresh = () =>
  useMutation("refresh", async ({ refreshToken }: { refreshToken: string }) => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh`,
      {
        refreshToken,
      }
    );
    return data;
  });
