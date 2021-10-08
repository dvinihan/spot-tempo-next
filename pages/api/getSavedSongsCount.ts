import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { addRetryHandler } from "../../util/axios";
import getUserId from "../../serverHelpers/getUserId";
import getDatabaseSavedSongs from "../../serverHelpers/getDatabaseSavedSongs";

export type Data = {
  count: number;
};

const getSavedSongsCount = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken } = req.query;

  const db = await connectToDatabase();

  const userId = await getUserId(accessToken as string);

  if (userId instanceof Error) {
    return res.status(500).send(userId);
  }

  const savedSongs = await getDatabaseSavedSongs(db, userId);
  const count = savedSongs.length;

  return res.status(200).send({ count });
};

export default getSavedSongsCount;
