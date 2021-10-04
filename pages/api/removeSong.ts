import type { NextApiRequest, NextApiResponse } from "next";
import {
  getDestinationPlaylistId,
  getPlaylists,
  getUserId,
} from "../../helpers/spotifyHelpers";
import { connectToDatabase } from "../../util/mongodb";
import { buildHeaders } from "../../helpers";
import axios from "axios";

export type Data = {};

const getSavedSongsCount = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { accessToken } = req.body;

  const db = await connectToDatabase();

  const playlistsPromise = getPlaylists(accessToken);
  const userIdPromise = getUserId(accessToken);

  const [playlists, userId] = await Promise.all([
    playlistsPromise,
    userIdPromise,
  ]);

  const destinationPlaylistId = await getDestinationPlaylistId(
    playlists,
    userId,
    accessToken
  );

  try {
    await axios({
      url: `https://api.spotify.com/v1/playlists/${destinationPlaylistId}/tracks`,
      method: "DELETE",
      headers: buildHeaders(accessToken),
      data: {
        tracks: [{ uri: req.query.songUri }],
      },
    });

    await db.collection("saved-songs").updateOne(
      {},
      { $set: { "songs.$[song].isInDestinationPlaylist": false } },
      {
        multi: true,
        arrayFilters: [{ "song.uri": req.body.songUri }],
      }
    );
    res.status(200).send({});
  } catch (error: any) {
    console.log("removeSong error", error.message);
  }
};

export default getSavedSongsCount;
