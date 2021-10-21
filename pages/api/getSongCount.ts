import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { addRetryHandler } from "../../util/axios";
import { getUserId } from "../../serverHelpers/getUserId";
import { Song } from "../../types/Song";
import { ListType } from "../../constants";
import { fetchAllDatabaseSongs } from "../../serverHelpers/fetchAllDatabaseSongs";

export type Data = {
  count: number;
};

const getSongCount = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken, listType } = req.query as {
    accessToken: string;
    listType: ListType;
  };

  const userId = await getUserId(accessToken as string);

  if (userId instanceof Error) {
    return res.status(500).send(userId);
  }

  const db = await connectToDatabase();
  const allDatabaseSongs = await fetchAllDatabaseSongs(db, userId);

  if (allDatabaseSongs instanceof Error) {
    return res.status(500).send(allDatabaseSongs);
  }

  const filterFn =
    listType === ListType.SAVED_SONG
      ? () => true
      : listType === ListType.PLAYLIST_SONG
      ? (song: Song) => song.isInPlaylist
      : listType === ListType.DISLIKED_SONG
      ? (song: Song) => song.isDisliked
      : () => {};

  return res
    .status(200)
    .send({ count: allDatabaseSongs.filter(filterFn).length });
};

export default getSongCount;
