import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { addRetryHandler } from "../../util/axios";
import { getDestinationPlaylistId } from "../../serverHelpers/getDestinationPlaylistId";
import { buildHeaders } from "../../util/headers";
import { connectToDatabase } from "../../util/mongodb";
import { SongAction } from "../../constants";
import { getUserId } from "../../serverHelpers/getUserId";

export type Data = { isInPlaylist?: boolean; isDisliked?: boolean };

const modifySong = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken, songUri, action } = req.body as {
    accessToken: string;
    songUri: string;
    action: SongAction;
  };

  const userId = await getUserId(accessToken);

  if (userId instanceof Error) {
    return res.status(500).send(userId);
  }

  const playlistId = await getDestinationPlaylistId(accessToken, userId);

  if (playlistId instanceof Error) {
    return res.status(500).send(playlistId);
  }

  const removeSong = async () => {
    await axios({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      method: "DELETE",
      headers: buildHeaders(accessToken),
      data: {
        tracks: [{ uri: songUri }],
      },
    });
  };

  let returnValues;
  try {
    switch (action) {
      case SongAction.ADD: {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          { uris: [songUri] },
          { headers: buildHeaders(accessToken) }
        );
        returnValues = { isInPlaylist: true };
        break;
      }
      case SongAction.REMOVE: {
        await removeSong();
        returnValues = { isInPlaylist: false };
        break;
      }
      case SongAction.DISLIKE: {
        const db = await connectToDatabase();
        await db.collection("saved-songs").updateOne(
          { userId },
          { $set: { "songs.$[song].isDisliked": true } },
          {
            multi: true,
            arrayFilters: [{ "song.uri": songUri }],
          }
        );
        await removeSong();
        returnValues = { isDisliked: true, isInPlaylist: false };
        break;
      }
    }

    return res.status(200).send(returnValues ?? {});
  } catch (error: any) {
    return res
      .status(500)
      .send({ name: `${action} Song`, message: error.message });
  }
};

export default modifySong;
