import type { NextApiRequest, NextApiResponse } from "next";
import { getUserId, handleLogin } from "../../helpers/spotifyHelpers";

export type Data = {
  accessToken: string;
  expiryTime: any;
  refreshToken: string;
  userId: string;
};

const login = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { code, redirectUri } = req.body;

  const authInfo = await handleLogin(code, redirectUri);

  const { accessToken, expiryTime, refreshToken } = authInfo ?? {};

  const userId = await getUserId(accessToken);

  return res
    .status(200)
    .send({ accessToken, expiryTime, refreshToken, userId });
};

export default login;
