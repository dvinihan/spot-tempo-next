export const DESTINATION_PLAYLIST_NAME = "SpotTempo";

export const BACKGROUND_COLOR = "#cdedcc";

export const ACCESS_TOKEN_COOKIE = "STAccessToken";
export const EXPIRY_TIME_COOKIE = "STExpiryTime";
export const REFRESH_TOKEN_COOKIE = "STRefreshToken";

export const AUTH_LOADING_TEXT = "Getting logged in";
export const SEARCH_LOADING_TEXT = "Loading songs";
export const SYNCING_SPOTIFY_TEXT = "Syncing with Spotify...";

export enum SongAction {
  ADD = "Add",
  REMOVE = "Remove",
  DISLIKE = "Dislike",
  RELIKE = "Relike",
}

export enum ListType {
  SAVED_SONG = "Saved",
  PLAYLIST_SONG = "Playlist",
  DISLIKED_SONG = "Disliked",
}

export enum Path {
  HOME = "/",
  PLAYLIST_SONGS = "/playlistSongs",
  DISLIKED_SONGS = "/dislikedSongs",
}
