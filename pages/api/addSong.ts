import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { addRetryHandler } from "../../util/axios";
import getPlaylistAndUserId from "../../serverHelpers/getPlaylistAndUserId";
import { buildHeaders } from "../../util/headers";

export type Data = {};

const addSong = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken } = req.body;

  const ids = await getPlaylistAndUserId(accessToken);

  if (ids instanceof Error) {
    return res.status(500).send(ids);
  }

  const { playlistId } = ids;

  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [req.body.songUri] },
      { headers: buildHeaders(accessToken) }
    );

    return res.status(200).send({});
  } catch (error: any) {
    return res.status(500).send({ name: "addSong", message: error.message });
  }
};

export default addSong;
