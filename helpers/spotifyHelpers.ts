import axios from "axios";
import { DESTINATION_PLAYLIST_NAME } from "../constants/index.js";
import Song from "../types/Song.js";
import { AudioFeature, SpotifyPlaylist } from "../types/SpotifyTypes.js";
import { buildHeaders, extractRelevantFields } from "./index.js";

export const createDestinationPlaylist = async (
  userId: string,
  accessToken: string
) => {
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
    return data.id;
  } catch (error: any) {
    console.log("error creating destination playlist", error.message);
  }
};

export const getDestinationPlaylistId = async (
  playlists: SpotifyPlaylist[],
  userId: string,
  accessToken: string
) => {
  const destinationPlaylist =
    playlists.find((playlist) => playlist.name === DESTINATION_PLAYLIST_NAME) ||
    (await createDestinationPlaylist(userId, accessToken));

  return destinationPlaylist.id;
};

export const getFreshPlaylistSongs = async (
  destinationPlaylistId: string,
  userId: string,
  accessToken: string
) => {
  // Refetch destination songs from Spotify
  return await getTracks({
    playlistId: destinationPlaylistId,
    userId,
    accessToken,
  });
};

export const getFreshSavedSongs = async (accessToken: string) => {
  // Refetch saved songs from Spotify
  return await getTracks({
    accessToken,
  });
};

export const getPlaylists = async (accessToken: string) => {
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
  }
};

export const getTracks = async ({
  playlistId,
  userId,
  accessToken,
}: {
  playlistId?: string;
  userId?: string;
  accessToken: string;
}) => {
  try {
    const tracksUrl = playlistId
      ? `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`
      : "https://api.spotify.com/v1/me/tracks";

    // Get the first batch of tracks and the total number of tracks
    const { data: firstTrackData } = await axios.get(`${tracksUrl}?limit=50`, {
      headers: buildHeaders(accessToken),
    });

    const total = firstTrackData.total;

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

    const songs = [...firstTrackData.items];
    promisesResponse.forEach((response) => {
      songs.push(...response.data.items);
    });

    const songsCompact = songs.map((song) => extractRelevantFields(song.track));

    return await addSongTempos(songsCompact, total, accessToken);
  } catch (error: any) {
    console.log(
      `error getting tracks from ${playlistId ? "playlist" : "saved songs"}:`,
      error.message
    );
  }
};

export const getUserId = async (accessToken: string) => {
  try {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: buildHeaders(accessToken),
    });

    return data.id;
  } catch (error: any) {
    console.log("error fetching userId:", error.message);
  }
};

export const handleLogin = async (code: string, redirectUri: string) => {
  const base64data = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization: `Basic ${base64data}`,
        },
      }
    );

    const currentTimeMilliseconds = Date.now();
    const expiresInMilliseconds = data.expires_in * 1000;
    const accessTokenExpiryTime =
      currentTimeMilliseconds + expiresInMilliseconds;

    return {
      accessToken: data.access_token,
      accessTokenExpiryTime,
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
  try {
    for (let j = 0; j <= total + 50; j += 50) {
      const songIds = songs
        .slice(j, j + 100)
        .map((track) => track.id)
        .join(",");

      const { data: audioFeatureData } = await axios.get(
        `https://api.spotify.com/v1/audio-features/?ids=${songIds}`,
        { headers: buildHeaders(accessToken) }
      );

      audioFeatureData.audio_features.forEach(
        (audioFeature: AudioFeature, index: number) => {
          if (audioFeature && audioFeature.tempo) {
            songs[j + index].tempo = Math.round(audioFeature.tempo);
          }
        }
      );
    }
  } catch (error: any) {
    console.log("error fetching audio features", error.message);
  }

  return songs;
};