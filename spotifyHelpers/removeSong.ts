import axios from "axios";
import { buildHeaders } from "../util/headers";

export const removeSong = async (
  accessToken: string,
  playlistId: string,
  songUri: string
) => {
  try {
    await axios({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      method: "DELETE",
      headers: buildHeaders(accessToken),
      data: {
        tracks: [{ uri: songUri }],
      },
    });
  } catch (error: any) {
    throw new Error(`error removing song ${songUri}: ${error.message}`);
  }
};
