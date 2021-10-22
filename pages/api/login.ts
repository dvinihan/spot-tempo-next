import type { NextApiRequest, NextApiResponse } from "next";
import { getUserId } from "../../spotifyHelpers/getUserId";
import { handleLogin } from "../../spotifyHelpers/handleLogin";
import { addRetryHandler } from "../../util/axios";

export type Data = {
  accessToken: string;
  expiryTime: any;
  refreshToken: string;
  userId: string;
};

const login = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  try {
    addRetryHandler();

    const { code, redirectUri } = req.body;

    const { accessToken, expiryTime, refreshToken } = await handleLogin({
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const userId = await getUserId(accessToken);

    return res
      .status(200)
      .send({ accessToken, expiryTime, refreshToken, userId });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

export default login;
