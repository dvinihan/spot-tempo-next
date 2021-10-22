import type { NextApiRequest, NextApiResponse } from "next";
import { addRetryHandler } from "../../util/axios";
import { getDestinationPlaylistId } from "../../spotifyHelpers/getDestinationPlaylistId";
import { connectToDatabase } from "../../util/mongodb";
import { SongAction } from "../../constants";
import { getUserId } from "../../spotifyHelpers/getUserId";
import { addSongInSpotify } from "../../spotifyHelpers/addSongInSpotify";
import { removeSongInSpotify } from "../../spotifyHelpers/removeSongInSpotify";
import { modifySongInDatabase } from "../../databaseHelpers/modifySongInDatabase";

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
        await addSongInSpotify(accessToken, playlistId, songUri);
        await modifySongInDatabase(db, userId, songUri, {
          isInPlaylist: true,
          isDisliked: false,
        });
        break;
      }
      case SongAction.REMOVE: {
        await removeSongInSpotify(accessToken, playlistId, songUri);
        await modifySongInDatabase(db, userId, songUri, {
          isInPlaylist: false,
        });
        break;
      }
      case SongAction.DISLIKE: {
        await removeSongInSpotify(accessToken, playlistId, songUri);
        await modifySongInDatabase(db, userId, songUri, {
          isInPlaylist: false,
          isDisliked: true,
        });
        break;
      }
      case SongAction.RELIKE: {
        await modifySongInDatabase(db, userId, songUri, {
          isDisliked: false,
        });
        break;
      }
    }

    return res.status(200).send(returnValues ?? {});
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export default modifySong;
