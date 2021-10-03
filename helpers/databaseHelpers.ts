import { Db } from "mongodb";
import Song from "../types/Song";
import { addPlaylistStatus } from "./index";
import {
  getPlaylists,
  getUserId,
  getDestinationPlaylistId,
  getFreshPlaylistSongs,
  getFreshSavedSongs,
} from "./spotifyHelpers";

export const getAccessToken = async (db: Db, userId: string) => {
  const document = await db.collection("saved-songs").findOne({ user: userId });
  return document?.accessToken;
};

export const getDatabaseSavedSongs = async (db: Db, userId: string) => {
  const document = await db.collection("saved-songs").findOne({ user: userId });
  return document?.songs ?? [];
};

export const updateDatabasePlaylistStatus = async (
  db: Db,
  destinationSongs: Song[]
) => {
  const destinationSongIds = destinationSongs.map((song) => song.id);

  try {
    await db.collection("saved-songs").updateMany(
      {},
      { $set: { "songs.$[song].isInDestinationPlaylist": true } },
      {
        arrayFilters: [{ "song.id": { $in: destinationSongIds } }],
      }
    );

    await db.collection("saved-songs").updateMany(
      {},
      { $set: { "songs.$[song].isInDestinationPlaylist": false } },
      {
        arrayFilters: [{ "song.id": { $not: { $in: destinationSongIds } } }],
      }
    );
  } catch (error: any) {
    console.log(
      "error updating isInDestinationPlaylist in MongoDB:",
      error.message
    );
  }
};

export const loadSavedSongs = async (db: Db, accessToken: string) => {
  const playlistsPromise = getPlaylists(accessToken);
  const userIdPromise = getUserId(accessToken);

  const [playlists, userId] = await Promise.all([
    playlistsPromise,
    userIdPromise,
  ]);

  const destinationPlaylistId = await getDestinationPlaylistId(
    playlists,
    userId,
    accessToken
  );

  const savedSongsPromise = getFreshSavedSongs(accessToken);
  const destinationSongsPromise = getFreshPlaylistSongs(
    destinationPlaylistId,
    userId,
    accessToken
  );

  const [savedSongs, destinationSongs] = await Promise.all([
    savedSongsPromise,
    destinationSongsPromise,
  ]);

  const savedSongsWithPlaylistStatus = addPlaylistStatus(
    savedSongs ?? [],
    destinationSongs ?? []
  );

  const userDocCount = await db
    .collection("saved-songs")
    .find({ user: userId })
    .count();

  if (userDocCount === 0) {
    console.log("adding user");
    await db.collection("saved-songs").insertOne({
      songs: savedSongsWithPlaylistStatus,
      user: userId,
      destinationPlaylistId,
    });
  } else {
    console.log("updating user");
    await db.collection("saved-songs").updateOne(
      { user: userId },
      {
        $set: {
          songs: savedSongsWithPlaylistStatus,
          destinationPlaylistId,
        },
      }
    );
  }
};
