import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { Song } from "../../types/Song";
import { addRetryHandler } from "../../util/axios";
import { ListType } from "../../constants";
import { fetchAllDatabaseSongs } from "../../databaseHelpers/fetchAllDatabaseSongs";
import { getUserId } from "../../spotifyHelpers/getUserId";

export type Data = { songs: Song[] };

export const getMatchingSongs = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  try {
    addRetryHandler();

    const { accessToken, start, end, listType, searchTerm } = req.query as {
      searchTerm: string;
      accessToken: string;
      start: string;
      end: string;
      listType: ListType;
    };

    const userId = await getUserId(accessToken as string);

    const db = await connectToDatabase();
    const allDatabaseSongs = await fetchAllDatabaseSongs(db, userId);

    const filterFn =
      listType === ListType.SAVED_SONG
        ? (song: Song) =>
            song.name.toLowerCase().includes(searchTerm.toLowerCase())
        : listType === ListType.PLAYLIST_SONG
        ? (song: Song) => song.isInPlaylist
        : listType === ListType.DISLIKED_SONG
        ? (song: Song) => song.isDisliked
        : listType === ListType.UNTOUCHED_SONG
        ? (song: Song) => !song.isInPlaylist && !song.isDisliked
        : () => {};

    return res.status(200).send({
      songs: allDatabaseSongs
        .filter(filterFn)
        .slice(parseInt(start), parseInt(end)),
    });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
};

export default getMatchingSongs;
