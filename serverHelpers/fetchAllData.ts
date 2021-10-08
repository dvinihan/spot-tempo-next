import { Db } from "mongodb";
import { AllData } from "../types/serverTypes";
import fetchTracksFromSpotify from "./fetchTracksFromSpotify";
import getDatabaseSavedSongs from "./getDatabaseSavedSongs";
import getPlaylistAndUserId from "./getPlaylistAndUserId";

const fetchAllData = async ({
  db,
  accessToken,
  shouldGetFreshSongs,
}: {
  db: Db;
  accessToken: string;
  shouldGetFreshSongs: boolean;
}): Promise<AllData | Error> => {
  const ids = await getPlaylistAndUserId(accessToken);

  if (ids instanceof Error) {
    return ids;
  }

  const { playlistId, userId } = ids;

  const [savedSongs, destinationSongs] = await Promise.all([
    shouldGetFreshSongs
      ? fetchTracksFromSpotify({
          tracksUrl: "https://api.spotify.com/v1/me/tracks",
          accessToken,
        })
      : getDatabaseSavedSongs(db, userId),
    fetchTracksFromSpotify({
      tracksUrl: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      accessToken,
    }),
  ]);

  if (savedSongs instanceof Error) {
    return savedSongs;
  }
  if (destinationSongs instanceof Error) {
    return destinationSongs;
  }

  return { savedSongs, destinationSongs, userId };
};

export default fetchAllData;
