import axios from "axios";
import { DESTINATION_PLAYLIST_NAME } from "../constants/index";
import Song from "../types/Song";
import { AudioFeature, SpotifyPlaylist } from "../types/SpotifyTypes";
import { buildHeaders, extractRelevantFields } from "./index";
import { retryHelper } from "./retryHelper";

type Ids = {
  playlistId: string;
  userId: string;
};

export const getPlaylistAndUserId = async (
  accessToken: string
): Promise<Ids> => {
  const [playlists, userId] = await Promise.all([
    getPlaylists(accessToken),
    getUserId(accessToken),
  ]);

  const destinationPlaylist =
    playlists.find((playlist) => playlist.name === DESTINATION_PLAYLIST_NAME) ||
    (await createDestinationPlaylist(userId, accessToken));

  return { playlistId: destinationPlaylist?.id ?? "", userId };
};

export const createDestinationPlaylist = async (
  userId: string,
  accessToken: string
): Promise<SpotifyPlaylist | undefined> => {
  try {
    const { data } = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: DESTINATION_PLAYLIST_NAME,
      },
      {
        headers: buildHeaders(accessToken),
      }
    );
    return data;
  } catch (error: any) {
    console.log("error creating destination playlist", error.message);
  }
};

export const getPlaylists = async (
  accessToken: string
): Promise<SpotifyPlaylist[]> => {
  try {
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: buildHeaders(accessToken),
      }
    );
    return data.items;
  } catch (error: any) {
    console.log("error fetching playlists:", error.message);
    return [];
  }
};

export const fetchTracksFromSpotify = async ({
  tracksUrl,
  accessToken,
}: {
  tracksUrl: string;
  accessToken: string;
}) => {
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
    console.log("error getting tracks from spotify:", error.message);
    return [];
  }
};

export const getUserId = async (accessToken: string): Promise<string> => {
  try {
    const response = await retryHelper(
      axios.get("https://api.spotify.com/v1/me", {
        headers: buildHeaders(accessToken),
      })
    );

    return response?.data.id;
  } catch (error: any) {
    console.log("error fetching userId:", error.message);
    return "";
  }
};

interface LoginBody {
  code: string;
  redirect_uri: string;
  grant_type: string;
}

interface RefreshBody {
  refresh_token: string;
  grant_type: string;
}

export const handleLogin = async (body: LoginBody | RefreshBody) => {
  const base64data = Buffer.from(
    `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams(body as any).toString(),
      {
        headers: {
          Authorization: `Basic ${base64data}`,
        },
      }
    );

    const currentTimeMilliseconds = Date.now();
    const expiresInMilliseconds = data.expires_in * 1000;
    const expiryTime = currentTimeMilliseconds + expiresInMilliseconds;

    return {
      accessToken: data.access_token,
      expiryTime,
      refreshToken: data.refresh_token,
    };
  } catch (error: any) {
    console.log("login error", error.message);
  }
};

export const addSongTempos = async (
  songs: Song[],
  total: number,
  accessToken: string
) => {
  const step = 100;

  try {
    const requests = [];
    for (let j = 0; j <= total; j += step) {
      const songIds = songs
        .slice(j, j + step)
        .map((track) => track.id)
        .join(",");

      // this call gets overloaded and results in 429 "Too many requests" errors from Spotify, so we need to wrap in a retry helper
      requests.push(
        retryHelper(
          axios.get(
            `https://api.spotify.com/v1/audio-features/?ids=${songIds}`,
            {
              headers: buildHeaders(accessToken),
            }
          )
        )
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
    console.log("error fetching audio features", error.message);
  }

  return songs;
};
