import type { NextApiRequest, NextApiResponse } from "next";
import { addRetryHandler } from "../../util/axios";
import { getDestinationPlaylistId } from "../../spotifyHelpers/getDestinationPlaylistId";
import { connectToDatabase } from "../../util/mongodb";
import { SongAction } from "../../constants";
import { getUserId } from "../../spotifyHelpers/getUserId";
import { addSong } from "../../spotifyHelpers/addSong";
import { removeSong } from "../../spotifyHelpers/removeSong";
import { dislikeSong } from "../../databaseHelpers/dislikeSong";

export type Data = { isInPlaylist?: boolean; isDisliked?: boolean };

const modifySong = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  try {
    addRetryHandler();

    const { accessToken, songUri, action } = req.body as {
      accessToken: string;
      songUri: string;
      action: SongAction;
    };

    const userId = await getUserId(accessToken);
    const playlistId = await getDestinationPlaylistId(accessToken, userId);

    let returnValues;
    switch (action) {
      case SongAction.ADD: {
        await addSong(accessToken, playlistId, songUri);
        returnValues = { isInPlaylist: true };
        break;
      }
      case SongAction.REMOVE: {
        await removeSong(accessToken, playlistId, songUri);
        returnValues = { isInPlaylist: false };
        break;
      }
      case SongAction.DISLIKE: {
        const db = await connectToDatabase();
        await dislikeSong(db, userId, songUri);
        await removeSong(accessToken, playlistId, songUri);
        returnValues = { isDisliked: true, isInPlaylist: false };
        break;
      }
    }

    return res.status(200).send(returnValues ?? {});
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export default modifySong;
