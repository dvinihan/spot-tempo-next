import type { NextApiRequest, NextApiResponse } from "next";
import { getPlaylistAndUserId } from "../../helpers/spotifyHelpers";
import { buildHeaders } from "../../helpers";
import axios from "axios";

export type Data = {};

const removeSong = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { accessToken } = req.body;

  const { playlistId } = await getPlaylistAndUserId(accessToken);

  try {
    await axios({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      method: "DELETE",
      headers: buildHeaders(accessToken),
      data: {
        tracks: [{ uri: req.query.songUri }],
      },
    });

    res.status(200).send({});
  } catch (error: any) {
    console.log("removeSong error", error.message);
  }
};

export default removeSong;
