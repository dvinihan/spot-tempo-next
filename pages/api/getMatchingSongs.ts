import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import { Song } from "../../types/Song";
import fetchAllData from "../../serverHelpers/fetchAllData";
import { addRetryHandler } from "../../util/axios";

export type Data = { songs: Song[] };

export const getMatchingSongs = async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  addRetryHandler();

  const { accessToken, bpm, start, end } = req.query as {
    accessToken: string;
    bpm: string;
    start: string;
    end: string;
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

  const matchingTracksWithPlaylistStatus = savedSongs
    .filter(
      (song) => song.tempo > Number(bpm) - 5 && song.tempo < Number(bpm) + 5
    )
    .map((song) => {
      const isInDestinationPlaylist = Boolean(
        destinationSongs?.find((s) => s.id === song.id)
      );
      return { ...song, isInDestinationPlaylist } as Song;
    });

  return res.status(200).send({
    songs: matchingTracksWithPlaylistStatus.slice(
      parseInt(start),
      parseInt(end)
    ),
  });
};

export default getMatchingSongs;
