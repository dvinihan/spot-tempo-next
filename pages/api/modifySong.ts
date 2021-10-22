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

    let songProperties;
    switch (action) {
      case SongAction.ADD: {
        await addSongInSpotify(accessToken, playlistId, songUri);
        songProperties = {
          isInPlaylist: true,
          isDisliked: false,
        };
        await modifySongInDatabase(db, userId, songUri, songProperties);
        break;
      }
      case SongAction.REMOVE: {
        await removeSongInSpotify(accessToken, playlistId, songUri);
        songProperties = {
          isInPlaylist: false,
        };
        await modifySongInDatabase(db, userId, songUri, songProperties);
        break;
      }
      case SongAction.DISLIKE: {
        await removeSongInSpotify(accessToken, playlistId, songUri);
        songProperties = {
          isInPlaylist: false,
          isDisliked: true,
        };
        await modifySongInDatabase(db, userId, songUri, songProperties);
        break;
      }
      case SongAction.RELIKE: {
        songProperties = {
          isDisliked: false,
        };
        await modifySongInDatabase(db, userId, songUri, songProperties);
        break;
      }
    }

    return res.status(200).send(songProperties ?? {});
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export default modifySong;
