import axios from "axios";
import { SpotifyPlaylist } from "../types/SpotifyTypes";
import { buildHeaders } from "../util/headers";

export const getPlaylists = async (
  accessToken: string
): Promise<SpotifyPlaylist[]> => {
  try {
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: buildHeaders(accessToken),
      }
    );
    return data.items;
  } catch (error: any) {
    throw new Error(`error fetching playlists: ${error.message}`);
  }
};
