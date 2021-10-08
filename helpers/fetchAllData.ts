import { Db } from "mongodb";
import { getDatabaseSavedSongs } from "./databaseHelpers";
import { fetchTracksFromSpotify, getPlaylistAndUserId } from "./spotifyHelpers";

const fetchAllData = async ({
  db,
  accessToken,
  shouldGetFreshSongs,
}: {
  db: Db;
  accessToken: string;
  shouldGetFreshSongs: boolean;
}) => {
  const { playlistId, userId } = await getPlaylistAndUserId(accessToken);

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

  return { savedSongs, destinationSongs, userId };
};

export default fetchAllData;
