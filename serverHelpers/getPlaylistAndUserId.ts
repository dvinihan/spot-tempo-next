import { DESTINATION_PLAYLIST_NAME } from "../constants";
import { Ids } from "../types/serverTypes";
import createDestinationPlaylist from "./createDestinationPlaylist";
import getPlaylists from "./getPlaylists";
import getUserId from "./getUserId";

const getPlaylistAndUserId = async (
  accessToken: string
): Promise<Ids | Error> => {
  const [playlists, userId] = await Promise.all([
    getPlaylists(accessToken),
    getUserId(accessToken),
  ]);

  if (userId instanceof Error) {
    return userId;
  }
  if (playlists instanceof Error) {
    return playlists;
  }

  const destinationPlaylist =
    playlists.find((playlist) => playlist.name === DESTINATION_PLAYLIST_NAME) ||
    (await createDestinationPlaylist(userId, accessToken));

  if (destinationPlaylist instanceof Error) {
    return destinationPlaylist;
  }

  return { playlistId: destinationPlaylist?.id ?? "", userId };
};

export default getPlaylistAndUserId;
