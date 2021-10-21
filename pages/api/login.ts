import type { NextApiRequest, NextApiResponse } from "next";
import { getUserId } from "../../serverHelpers/getUserId";
import { handleLogin } from "../../serverHelpers/handleLogin";
import { addRetryHandler } from "../../util/axios";

export type Data = {
  accessToken: string;
  expiryTime: any;
  refreshToken: string;
  userId: string;
};

const login = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { code, redirectUri } = req.body;

  const authInfo = await handleLogin({
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  if (authInfo instanceof Error) {
    return res.status(500).send(authInfo);
  }

  const { accessToken, expiryTime, refreshToken } = authInfo;

  const userId = await getUserId(accessToken);

  if (userId instanceof Error) {
    return res.status(500).send(userId);
  }

  return res
    .status(200)
    .send({ accessToken, expiryTime, refreshToken, userId });
};

export default login;
