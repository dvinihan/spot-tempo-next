import axios from "axios";
import { Song } from "../types/Song";
import { SpotifySong } from "../types/SpotifyTypes";
import { buildHeaders } from "../util/headers";
import addSongTempos from "./addSongTempos";

const fetchTracksFromSpotify = async ({
  tracksUrl,
  accessToken,
}: {
  tracksUrl: string;
  accessToken: string;
}): Promise<Song[] | Error> => {
  try {
    // Get the first batch of tracks and the total number of tracks
    const response = await axios.get(`${tracksUrl}?limit=50`, {
      headers: buildHeaders(accessToken),
    });

    const { items, total } = response.data;

    // Get the rest of the tracks
    const promises = [];
    for (let i = 50; i <= total; i += 50) {
      promises.push(
        axios.get(`${tracksUrl}?limit=50&offset=${i}`, {
          headers: buildHeaders(accessToken),
        })
      );
    }

    const promisesResponse = await Promise.all(promises);

    const songs = [...items];
    promisesResponse.forEach((res) => {
      songs.push(...res.data.items);
    });

    const songsCompact = songs.map((song) => extractRelevantFields(song.track));

    return await addSongTempos(songsCompact, total, accessToken);
  } catch (error: any) {
    return new Error(`error fetching tracks from Spotify: ${error.message}`);
  }
};

const extractRelevantFields = (song: SpotifySong) => {
  const { artists, id, name, uri } = song;

  const artistNamesList = artists.reduce(
    (acc, artist) => [...acc, artist.name],
    [] as string[]
  );
  const artistNameString = artistNamesList.reduce((name, artist, index) => {
    const addition =
      index === 0 && artistNamesList.length === 1
        ? artist
        : index === 0
        ? `${artist} feat. `
        : index === 1
        ? artist
        : index === artistNamesList.length - 1
        ? ` & ${artist}`
        : `, ${artist}`;
    return name.concat(addition);
  }, "");

  return { artist: artistNameString, id, name, uri } as Song;
};

export default fetchTracksFromSpotify;
