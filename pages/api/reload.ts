import type { NextApiRequest, NextApiResponse } from "next";
import { getUserId } from "../../helpers/spotifyHelpers";
import { connectToDatabase } from "../../util/mongodb";
import {
  getDatabaseSavedSongs,
  loadSavedSongs,
} from "../../helpers/databaseHelpers";

export type Data = {
  count: number;
};

const reload = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { accessToken } = req.body;

  const db = await connectToDatabase();

  const userId = await getUserId(accessToken);

  await loadSavedSongs(db, accessToken);
  const savedSongs = await getDatabaseSavedSongs(db, userId);
  const count = savedSongs.length;

  res.status(200).send({ count });
};

export default reload;
