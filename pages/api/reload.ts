import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import fetchAllData from "../../helpers/fetchAllData";

export type Data = {
  count: number;
};

const reload = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { accessToken } = req.body;

  const db = await connectToDatabase();

  const { savedSongs, userId } = await fetchAllData({
    db,
    accessToken,
    shouldGetFreshSongs: true,
  });

  const userDocCount = await db
    .collection("saved-songs")
    .find({ userId })
    .count();

  if (userDocCount === 0) {
    await db.collection("saved-songs").insertOne({
      songs: savedSongs,
      userId,
    });
  } else {
    await db.collection("saved-songs").updateOne(
      { userId },
      {
        $set: {
          songs: savedSongs,
        },
      }
    );
  }

  res.status(200).send({});
};

export default reload;
