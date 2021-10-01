type Song = {
  id: string;
  uri: string;
  name: string;
  artist: string;
  tempo?: number;
  isInDestinationPlaylist: boolean;
};

export default Song;
