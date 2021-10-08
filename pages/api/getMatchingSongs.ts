import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import Song from "../../types/Song";
import fetchAllData from "../../helpers/fetchAllData";

export type Data = { songs: Song[] };

export const getMatchingSongs = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { accessToken, bpm, start, end } = req.query as {
    accessToken: string;
    bpm: string;
    start: string;
    end: string;
  };

  const db = await connectToDatabase();

  const { savedSongs, destinationSongs } = await fetchAllData({
    db,
    accessToken,
    shouldGetFreshSongs: false,
  });

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

  res.status(200).send({
    songs: matchingTracksWithPlaylistStatus.slice(
      parseInt(start),
      parseInt(end)
    ),
  });
};

export default getMatchingSongs;
