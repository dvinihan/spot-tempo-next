import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { addRetryHandler } from "../../util/axios";
import getPlaylistAndUserId from "../../serverHelpers/getPlaylistAndUserId";
import { buildHeaders } from "../../util/headers";
import { ADD, REMOVE } from "../../constants/index";

export type Data = { isInDestinationPlaylist: boolean };

const addOrRemoveSong = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken, songUri, action } = req.body;

  const ids = await getPlaylistAndUserId(accessToken);

  if (ids instanceof Error) {
    return res.status(500).send(ids);
  }

  const { playlistId } = ids;

  try {
    if (action === ADD) {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: [songUri] },
        { headers: buildHeaders(accessToken) }
      );
    }

    if (action === REMOVE) {
      await axios({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        method: "DELETE",
        headers: buildHeaders(accessToken),
        data: {
          tracks: [{ uri: songUri }],
        },
      });
    }

    return res.status(200).send({ isInDestinationPlaylist: action === ADD });
  } catch (error: any) {
    return res
      .status(500)
      .send({ name: `${action} Song`, message: error.message });
  }
};

export default addOrRemoveSong;
