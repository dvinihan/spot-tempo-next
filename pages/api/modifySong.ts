import type { NextApiRequest, NextApiResponse } from "next";
import { addRetryHandler } from "../../util/axios";
import { getDestinationPlaylistId } from "../../spotifyHelpers/getDestinationPlaylistId";
import { connectToDatabase } from "../../util/mongodb";
import { SongAction } from "../../constants";
import { getUserId } from "../../spotifyHelpers/getUserId";
import { addSong } from "../../spotifyHelpers/addSong";
import { removeSong } from "../../spotifyHelpers/removeSong";
import { changeSongTaste } from "../../databaseHelpers/changeSongTaste";

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

    const db = await connectToDatabase();
    let returnValues;
    switch (action) {
      case SongAction.ADD: {
        await addSong(accessToken, playlistId, songUri);
        await changeSongTaste(db, userId, songUri, false);
        returnValues = { isInPlaylist: true, isDisliked: false };
        break;
      }
      case SongAction.REMOVE: {
        await removeSong(accessToken, playlistId, songUri);
        returnValues = { isInPlaylist: false };
        break;
      }
      case SongAction.DISLIKE: {
        await changeSongTaste(db, userId, songUri, true);
        await removeSong(accessToken, playlistId, songUri);
        returnValues = { isInPlaylist: false, isDisliked: true };
        break;
      }
      case SongAction.RELIKE: {
        await changeSongTaste(db, userId, songUri, false);
        returnValues = { isDisliked: false };
        break;
      }
    }

    return res.status(200).send(returnValues ?? {});
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export default modifySong;
