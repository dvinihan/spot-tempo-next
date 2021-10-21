import type { NextApiRequest, NextApiResponse } from "next";
import handleLogin from "../../serverHelpers/handleLogin";
import { addRetryHandler } from "../../util/axios";

export type Data = {
  accessToken: string;
  expiryTime: any;
  refreshToken: string;
};

const refreshAuth = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { refreshToken } = req.body;

  const authInfo = await handleLogin({
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  if (authInfo instanceof Error) {
    return res.status(500).send(authInfo);
  }

  const { accessToken, expiryTime, refreshToken: newRefreshToken } = authInfo;

  return res.status(200).send({
    accessToken,
    expiryTime,
    refreshToken: newRefreshToken,
  });
};

export default refreshAuth;
