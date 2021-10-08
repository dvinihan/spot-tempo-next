import type { NextApiRequest, NextApiResponse } from "next";
import { getPlaylistAndUserId } from "../../helpers/spotifyHelpers";
import axios from "axios";
import { buildHeaders } from "../../helpers";

export type Data = {};

const addSong = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { accessToken } = req.body;

  const { playlistId } = await getPlaylistAndUserId(accessToken);

  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [req.body.songUri] },
      { headers: buildHeaders(accessToken) }
    );

    res.status(200).send({});
  } catch (error: any) {
    console.log("addSong error", error.message);
  }
};

export default addSong;
