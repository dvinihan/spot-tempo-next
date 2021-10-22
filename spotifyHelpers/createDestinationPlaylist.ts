import axios from "axios";
import { DESTINATION_PLAYLIST_NAME } from "../constants";
import { SpotifyPlaylist } from "../types/SpotifyTypes";
import { buildHeaders } from "../util/headers";

export const createDestinationPlaylist = async (
  userId: string,
  accessToken: string
): Promise<SpotifyPlaylist> => {
  try {
    const { data } = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: DESTINATION_PLAYLIST_NAME,
      },
      {
        headers: buildHeaders(accessToken),
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(`error creating destination playlist:", ${error.message}`);
  }
};
