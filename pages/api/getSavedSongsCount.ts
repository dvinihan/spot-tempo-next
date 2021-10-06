import type { NextApiRequest, NextApiResponse } from "next";
import { getUserId } from "../../helpers/spotifyHelpers";
import { connectToDatabase } from "../../util/mongodb";
import { getDatabaseSavedSongs } from "../../helpers/databaseHelpers";

export type Data = {
  count: number;
};

const getSavedSongsCount = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { accessToken } = req.query;

  const db = await connectToDatabase();

  const userId = await getUserId(accessToken as string);

  const savedSongs = await getDatabaseSavedSongs(db, userId);
  const count = savedSongs.length;

  res.status(200).send({ count });
};

export default getSavedSongsCount;
