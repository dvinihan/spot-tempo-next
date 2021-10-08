import Song from "../types/Song";
import { SpotifySong } from "../types/SpotifyTypes";

export const buildHeaders = (accessToken: string) => {
  return { Authorization: `Bearer ${accessToken}` };
};

export const extractRelevantFields = (song: SpotifySong) => {
  const { artists, id, name, uri } = song;

  const artistNamesList = artists.reduce(
    (acc, artist) => [...acc, artist.name],
    [] as string[]
  );
  const artistNameString = buildArtistName(artistNamesList);

  return { artist: artistNameString, id, name, uri } as Song;
};

const buildArtistName = (artists: string[]) => {
  return artists.reduce((name, artist, index) => {
    const addition =
      index === 0 && artists.length === 1
        ? artist
        : index === 0
        ? `${artist} feat. `
        : index === 1
        ? artist
        : index === artists.length - 1
        ? ` & ${artist}`
        : `, ${artist}`;
    return name.concat(addition);
  }, "");
};
