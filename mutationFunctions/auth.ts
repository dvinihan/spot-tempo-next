import axios from "axios";

export const login = async ({ code }: { code: string }) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
    {
      code,
      redirectUri: process.env.NEXT_PUBLIC_BASE_URL,
    }
  );
  return data;
};

export const refreshAuth = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/refreshAuth`,
    {
      refreshToken,
    }
  );
  return data;
};
