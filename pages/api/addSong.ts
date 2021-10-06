import type { NextApiRequest, NextApiResponse } from "next";
import {
  getDestinationPlaylistId,
  getPlaylists,
  getUserId,
} from "../../helpers/spotifyHelpers";
import { connectToDatabase } from "../../util/mongodb";
import axios from "axios";
import { buildHeaders } from "../../helpers";

export type Data = {};

const addSong = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
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
    await axios.post(
      `https://api.spotify.com/v1/playlists/${destinationPlaylistId}/tracks`,
      { uris: [req.body.songUri] },
      { headers: buildHeaders(accessToken) }
    );

    await db.collection("saved-songs").updateOne(
      {},
      { $set: { "songs.$[song].isInDestinationPlaylist": true } },
      {
        multi: true,
        arrayFilters: [{ "song.uri": req.body.songUri }],
      }
    );

    res.status(200).send({});
  } catch (error: any) {
    console.log("addSong error", error.message);
  }
};

export default addSong;
