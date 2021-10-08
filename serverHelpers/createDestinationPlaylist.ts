import axios from "axios";
import { DESTINATION_PLAYLIST_NAME } from "../constants";
import { SpotifyPlaylist } from "../types/SpotifyTypes";
import { buildHeaders } from "../util/headers";

const createDestinationPlaylist = async (
  userId: string,
  accessToken: string
): Promise<SpotifyPlaylist | Error> => {
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
    return new Error(`error creating destination playlist:", ${error.message}`);
  }
};

export default createDestinationPlaylist;
