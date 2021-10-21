import { AllData } from "../types/serverTypes";
import fetchTracksFromSpotify from "./fetchTracksFromSpotify";
import getPlaylistAndUserId from "./getPlaylistAndUserId";

const fetchAllSpotifySongs = async ({
  accessToken,
}: {
  accessToken: string;
}): Promise<AllData | Error> => {
  const ids = await getPlaylistAndUserId(accessToken);

  if (ids instanceof Error) {
    return ids;
  }

  const { playlistId, userId } = ids;

  const [savedSongs, destinationSongs] = await Promise.all([
    fetchTracksFromSpotify({
      tracksUrl: "https://api.spotify.com/v1/me/tracks",
      accessToken,
    }),
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

export default fetchAllSpotifySongs;
