import axios from "axios";
import Song from "../types/Song";
import { AudioFeature } from "../types/SpotifyTypes";
import { buildHeaders } from "../util/headers";

const addSongTempos = async (
  songs: Song[],
  total: number,
  accessToken: string
): Promise<Song[] | Error> => {
  const step = 100;

  try {
    const requests = [];
    for (let j = 0; j <= total; j += step) {
      const songIds = songs
        .slice(j, j + step)
        .map((track) => track.id)
        .join(",");

      requests.push(
        axios.get(`https://api.spotify.com/v1/audio-features/?ids=${songIds}`, {
          headers: buildHeaders(accessToken),
        })
      );
    }

    const resolvedRequests = await Promise.all(requests);

    const songsWithTempos: Song[] = [];
    resolvedRequests.forEach((response) => {
      response?.data.audio_features.forEach(({ id, tempo }: AudioFeature) => {
        const song = songs.find((s) => s.id === id);
        songsWithTempos.push({ ...song, tempo: Math.round(tempo) } as Song);
      });
    });
    return songsWithTempos;
  } catch (error: any) {
    return new Error(`error fetching audio features: ${error.message}`);
  }
};

export default addSongTempos;