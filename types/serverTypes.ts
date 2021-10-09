import { Song } from "./Song";

export type Tokens = {
  accessToken: string;
  expiryTime: number;
  refreshToken: string;
};

export type LoginBody = {
  code: string;
  redirect_uri: string;
  grant_type: string;
};

export type RefreshBody = {
  refresh_token: string;
  grant_type: string;
};

export type Ids = {
  playlistId: string;
  userId: string;
};

export type AllData = {
  savedSongs: Song[];
  destinationSongs: Song[];
  userId: string;
};
