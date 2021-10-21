import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { addRetryHandler } from "../../util/axios";
import getUserId from "../../serverHelpers/getUserId";
import getDatabaseSavedSongs from "../../serverHelpers/getDatabaseSavedSongs";
import { Song } from "../../types/Song";
import { ListType } from "../../constants";

export type Data = {
  count: number;
};

const getSongCount = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken, listType } = req.query as {
    accessToken: string;
    listType: ListType;
  };
  const db = await connectToDatabase();

  const userId = await getUserId(accessToken as string);

  if (userId instanceof Error) {
    return res.status(500).send(userId);
  }

  const savedSongs = await getDatabaseSavedSongs(db, userId);

  let songList: Song[] = [];
  switch (listType) {
    case ListType.SAVED_SONG: {
      songList = savedSongs;
    }
    case ListType.ADDED_SONG: {
      songList = savedSongs.filter((song) => song.isInDestinationPlaylist);
    }
    case ListType.DISLIKED_SONG: {
      songList = savedSongs.filter((song) => song.isDisliked);
    }
  }

  return res.status(200).send({ count: songList.length });
};

export default getSongCount;
