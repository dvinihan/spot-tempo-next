import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { addRetryHandler } from "../../util/axios";
import { getUserId } from "../../spotifyHelpers/getUserId";
import { Song } from "../../types/Song";
import { ListType } from "../../constants";
import { fetchAllDatabaseSongs } from "../../databaseHelpers/fetchAllDatabaseSongs";

export type Data = {
  count: number;
  untouchedSongCount: number;
};

const getSongCount = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  try {
    addRetryHandler();

    const { accessToken, listType } = req.query as {
      accessToken: string;
      listType: ListType;
    };

    const userId = await getUserId(accessToken as string);

    const db = await connectToDatabase();
    const allDatabaseSongs = await fetchAllDatabaseSongs(db, userId);

    const filterFn =
      listType === ListType.SAVED_SONG
        ? () => true
        : listType === ListType.PLAYLIST_SONG
        ? (song: Song) => song.isInPlaylist
        : listType === ListType.DISLIKED_SONG
        ? (song: Song) => song.isDisliked
        : () => {};

    const untouchedSongs = allDatabaseSongs.filter(
      (song) => !song.isInPlaylist && !song.isDisliked
    );

    return res.status(200).send({
      count: allDatabaseSongs.filter(filterFn).length,
      untouchedSongCount: untouchedSongs.length,
    });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

export default getSongCount;
