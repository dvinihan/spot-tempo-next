import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import fetchAllData from "../../serverHelpers/fetchAllData";
import { addRetryHandler } from "../../util/axios";

export type Data = {};

const reload = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken } = req.body;

  const db = await connectToDatabase();

  const allData = await fetchAllData({
    db,
    accessToken,
    shouldGetFreshSongs: true,
  });

  if (allData instanceof Error) {
    return res.status(500).send(allData);
  }

  const { savedSongs, userId } = allData;

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

  return res.status(200).send({});
};

export default reload;
