import { DESTINATION_PLAYLIST_NAME } from "../constants";
import { createDestinationPlaylist } from "./createDestinationPlaylist";
import { getPlaylists } from "./getPlaylists";

export const getDestinationPlaylistId = async (
  accessToken: string,
  userId: string
): Promise<string> => {
  const playlists = await getPlaylists(accessToken);

  const destinationPlaylist =
    playlists.find((playlist) => playlist.name === DESTINATION_PLAYLIST_NAME) ||
    (await createDestinationPlaylist(userId, accessToken));

  return destinationPlaylist?.id ?? "";
};
