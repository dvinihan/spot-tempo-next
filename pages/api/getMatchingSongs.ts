import type { NextApiRequest, NextApiResponse } from "next";
import {
  getDestinationPlaylistId,
  getFreshPlaylistSongs,
  getPlaylists,
  getUserId,
} from "../../helpers/spotifyHelpers";
import { connectToDatabase } from "../../util/mongodb";
import {
  getDatabaseSavedSongs,
  updateDatabasePlaylistStatus,
} from "../../helpers/databaseHelpers";
import Song from "../../types/Song";

export type Data = { songs: Song[] };

export const getMatchingSongs = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { accessToken } = req.query;

  const db = await connectToDatabase();

  const playlistsPromise = getPlaylists(accessToken as string);
  const userIdPromise = getUserId(accessToken as string);

  const [playlists, userId] = await Promise.all([
    playlistsPromise,
    userIdPromise,
  ]);

  const destinationPlaylistId = await getDestinationPlaylistId(
    playlists,
    userId,
    accessToken as string
  );

  const destinationSongs = await getFreshPlaylistSongs(
    destinationPlaylistId,
    userId,
    accessToken as string
  );
  await updateDatabasePlaylistStatus(db, destinationSongs);

  const savedSongs = await getDatabaseSavedSongs(db, userId);

  const matchingTracks = savedSongs.filter(
    (track: any) =>
      track.tempo > Number(req.query.bpm) - 5 &&
      track.tempo < Number(req.query.bpm) + 5
  );

  res
    .status(200)
    .send({ songs: matchingTracks.slice(req.query.start, req.query.end) });
};

export default getMatchingSongs;
