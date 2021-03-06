import type { NextApiRequest, NextApiResponse } from "next";
import { handleLogin } from "../../spotifyHelpers/handleLogin";
import { addRetryHandler } from "../../util/axios";

export type Data = {
  accessToken: string;
  expiryTime: any;
  refreshToken: string;
};

const refreshAuth = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  try {
    addRetryHandler();

    const { refreshToken } = req.body;

    const authInfo = await handleLogin({
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    return res.status(200).send(authInfo);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export default refreshAuth;
