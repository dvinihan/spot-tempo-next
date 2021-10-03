import axios from "axios";

export const refresh = async (refreshToken: string) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/refresh`,
    {
      refreshToken,
    }
  );
  return data;
};

export const login = async (code: string) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
    {
      code,
      redirectUri: process.env.NEXT_PUBLIC_BASE_URL,
    }
  );
  return data;
};
