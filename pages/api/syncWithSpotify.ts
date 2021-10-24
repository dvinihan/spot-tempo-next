import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { addRetryHandler } from "../../util/axios";
import { Song } from "../../types/Song";
import { fetchAllDatabaseSongs } from "../../databaseHelpers/fetchAllDatabaseSongs";
import { getUserId } from "../../spotifyHelpers/getUserId";
import { getDestinationPlaylistId } from "../../spotifyHelpers/getDestinationPlaylistId";
import { fetchTracksFromSpotify } from "../../spotifyHelpers/fetchTracksFromSpotify";
import { insertUserAndSongs } from "../../databaseHelpers/insertUserAndSongs";
import { updateSongs } from "../../databaseHelpers/updateSongs";
import { getDoesUserExist } from "../../databaseHelpers/getUser";
import { addSongTempos } from "../../spotifyHelpers/addSongTempos";

export type Data = {};

const syncWithSpotify = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  try {
    addRetryHandler();

    const { accessToken } = req.body;

    const userId = await getUserId(accessToken as string);
    const playlistId = await getDestinationPlaylistId(accessToken, userId);

    const db = await connectToDatabase();
    const [savedSongs, destinationSongs, doesUserExist] = await Promise.all([
      fetchTracksFromSpotify({
        tracksUrl: "https://api.spotify.com/v1/me/tracks",
        accessToken,
      }),
      fetchTracksFromSpotify({
        tracksUrl: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        accessToken,
      }),
      getDoesUserExist(db, userId),
    ]);

    const [savedSongsWithTempo, destinationSongsWithTempo, databaseSavedSongs] =
      await Promise.all([
        addSongTempos(savedSongs, accessToken),
        addSongTempos(destinationSongs, accessToken),
        fetchAllDatabaseSongs(db, userId),
      ]);

    if (doesUserExist) {
      // if user has disliked some songs, we need to keep that info
      // const databaseSavedSongs = await fetchAllDatabaseSongs(db, userId);
      const dislikedSongs = databaseSavedSongs.filter(
        (song) => song.isDisliked
      );

      const allSongs = savedSongsWithTempo.map(
        (song) =>
          ({
            ...song,
            isInPlaylist: getIsSongInList(song, destinationSongsWithTempo),
            isDisliked: getIsSongInList(song, dislikedSongs),
          } as Song)
      );

      await updateSongs(db, userId, allSongs);
    } else {
      const allSongs = savedSongsWithTempo.map(
        (song) =>
          ({
            ...song,
            isInPlaylist: getIsSongInList(song, destinationSongsWithTempo),
          } as Song)
      );

      await insertUserAndSongs(db, userId, allSongs);
    }

    return res.status(200).send({});
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

const getIsSongInList = (song: Song, list: Song[]) =>
  Boolean(list.find((s) => s.id === song.id));

export default syncWithSpotify;
