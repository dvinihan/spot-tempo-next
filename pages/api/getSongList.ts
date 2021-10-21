import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { Song } from "../../types/Song";
import fetchAllData from "../../serverHelpers/fetchAllData";
import { addRetryHandler } from "../../util/axios";
import { ListType } from "../../constants";

export type Data = { songs: Song[] };

export const getMatchingSongs = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken, bpm, start, end, listType } = req.query as {
    accessToken: string;
    bpm: string;
    start: string;
    end: string;
    listType: ListType;
  };

  const db = await connectToDatabase();

  const allData = await fetchAllData({
    db,
    accessToken,
    shouldGetFreshSongs: false,
  });

  if (allData instanceof Error) {
    return res.status(500).send(allData);
  }

  const { savedSongs, destinationSongs } = allData;

  let songList: Song[] = [];
  switch (listType) {
    case ListType.SAVED_SONG: {
      songList = savedSongs
        .filter(
          (song) =>
            song.tempo > Number(bpm) - 5 &&
            song.tempo < Number(bpm) + 5 &&
            !song.isDisliked &&
            !song.isInDestinationPlaylist
        )
        .map((song) => {
          const isInDestinationPlaylist = Boolean(
            destinationSongs?.find((s) => s.id === song.id)
          );
          return { ...song, isInDestinationPlaylist } as Song;
        });
    }
    case ListType.ADDED_SONG: {
      songList = savedSongs.filter((song) => song.isInDestinationPlaylist);
    }
    case ListType.DISLIKED_SONG: {
      songList = savedSongs.filter((song) => song.isDisliked);
    }
  }

  return res.status(200).send({
    songs: songList.slice(parseInt(start), parseInt(end)),
  });
};

export default getMatchingSongs;
