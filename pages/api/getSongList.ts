import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { Song } from "../../types/Song";
import { addRetryHandler } from "../../util/axios";
import { ListType } from "../../constants";
import { fetchAllDatabaseSongs } from "../../serverHelpers/fetchAllDatabaseSongs";
import { getUserId } from "../../serverHelpers/getUserId";

export type Data = { songs: Song[] };

export const getMatchingSongs = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken, bpm, start, end, listType } = req.query as {
    accessToken: string;
    bpm: string;
    start: string;
    end: string;
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
      ? (song: Song) =>
          song.tempo > Number(bpm) - 5 &&
          song.tempo < Number(bpm) + 5 &&
          !song.isDisliked &&
          !song.isInPlaylist
      : listType === ListType.PLAYLIST_SONG
      ? (song: Song) => song.isInPlaylist
      : listType === ListType.DISLIKED_SONG
      ? (song: Song) => song.isDisliked
      : () => {};

  return res.status(200).send({
    songs: allDatabaseSongs
      .filter(filterFn)
      .slice(parseInt(start), parseInt(end)),
  });
};

export default getMatchingSongs;
