import axios from "axios";
import { LoginBody, RefreshBody, Tokens } from "../types/serverTypes";

const handleLogin = async (
  body: LoginBody | RefreshBody
): Promise<Tokens | Error> => {
  const base64data = Buffer.from(
    `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams(body as any).toString(),
      {
        headers: {
          Authorization: `Basic ${base64data}`,
        },
      }
    );

    const currentTimeMilliseconds = Date.now();
    const expiresInMilliseconds = data.expires_in * 1000;
    const expiryTime = currentTimeMilliseconds + expiresInMilliseconds;

    return {
      accessToken: data.access_token,
      expiryTime,
      refreshToken: data.refresh_token,
    };
  } catch (error: any) {
    return new Error(`error logging in: ${error.message}`);
  }
};

export default handleLogin;
