import { ADD, REMOVE } from "../constants/index";

export type Song = {
  id: string;
  uri: string;
  name: string;
  artist: string;
  tempo: number;
  isInDestinationPlaylist: boolean;
};

export type SongAction = typeof ADD | typeof REMOVE;
