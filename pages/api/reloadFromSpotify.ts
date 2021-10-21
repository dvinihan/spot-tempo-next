import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { addRetryHandler } from "../../util/axios";
import { Song } from "../../types/Song";
import fetchAllSpotifySongs from "../../serverHelpers/fetchAllSpotifySongs";
import fetchAllDatabaseSongs from "../../serverHelpers/fetchAllDatabaseSongs";

export type Data = {};

const reloadFromSpotify = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken } = req.body;

  const allSpotifySongs = await fetchAllSpotifySongs({
    accessToken,
  });

  if (allSpotifySongs instanceof Error) {
    return res.status(500).send(allSpotifySongs);
  }

  const { savedSongs, destinationSongs, userId } = allSpotifySongs;

  // if user has disliked some songs, we need to keep that info
  const db = await connectToDatabase();
  const databaseSavedSongs = await fetchAllDatabaseSongs(db, userId);
  const dislikedSongs = databaseSavedSongs.filter((song) => song.isDisliked);

  const allSongs = savedSongs.map((song) => {
    const isInPlaylist = Boolean(
      destinationSongs.find((s) => s.id === song.id)
    );
    const isDisliked = Boolean(dislikedSongs.find((s) => s.id === song.id));

    return { ...song, isInPlaylist, isDisliked } as Song;
  });

  const userDocCount = await db
    .collection("saved-songs")
    .find({ userId })
    .count();

  if (userDocCount === 0) {
    await db.collection("saved-songs").insertOne({
      songs: allSongs,
      userId,
    });
  } else {
    await db.collection("saved-songs").updateOne(
      { userId },
      {
        $set: {
          songs: allSongs,
        },
      }
    );
  }

  return res.status(200).send({});
};

export default reloadFromSpotify;
