import { DESTINATION_PLAYLIST_NAME } from "../constants";
import { createDestinationPlaylist } from "./createDestinationPlaylist";
import { getPlaylists } from "./getPlaylists";

export const getDestinationPlaylistId = async (
  accessToken: string,
  userId: string
): Promise<string | Error> => {
  const playlists = await getPlaylists(accessToken);

  if (playlists instanceof Error) {
    return playlists;
  }

  const destinationPlaylist =
    playlists.find((playlist) => playlist.name === DESTINATION_PLAYLIST_NAME) ||
    (await createDestinationPlaylist(userId, accessToken));

  if (destinationPlaylist instanceof Error) {
    return destinationPlaylist;
  }

  return destinationPlaylist?.id ?? "";
};
