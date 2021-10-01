export type SpotifySong = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  uri: string;
};

export type SpotifyArtist = {
  name: string;
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
};

export type AudioFeature = {
  tempo: number;
};
