import axios from "axios";
import { buildHeaders } from "../util/headers";

export const addSong = async (
  accessToken: string,
  playlistId: string,
  songUri: string
) => {
  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [songUri] },
      { headers: buildHeaders(accessToken) }
    );
  } catch (error: any) {
    throw new Error(`error adding song ${songUri}: ${error.message}`);
  }
};
