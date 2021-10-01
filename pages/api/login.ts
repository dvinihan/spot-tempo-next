import type { NextApiRequest, NextApiResponse } from "next";
import { getUserId, handleLogin } from "../../helpers/spotifyHelpers";

export type LoginData = {
  accessToken: string;
  accessTokenExpiryTime: number;
  refreshToken: string;
  userId: string;
};

const login = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const { code, redirectUri } = req.body;

  const authInfo = await handleLogin(code, redirectUri);

  const { accessToken, accessTokenExpiryTime, refreshToken } = authInfo ?? {};

  const userId = await getUserId(accessToken);

  return res
    .status(200)
    .send({ accessToken, accessTokenExpiryTime, refreshToken, userId });
};

export default login;
