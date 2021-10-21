import { Song } from "../types/Song";
import { fetchTracksFromSpotify } from "./fetchTracksFromSpotify";
import { getDestinationPlaylistId } from "./getDestinationPlaylistId";

export const fetchAllSpotifySongs = async ({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: string;
}): Promise<
  | {
      savedSongs: Song[];
      destinationSongs: Song[];
    }
  | Error
> => {
  const playlistId = await getDestinationPlaylistId(accessToken, userId);

  if (playlistId instanceof Error) {
    return playlistId;
  }

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

  return { savedSongs, destinationSongs };
};
