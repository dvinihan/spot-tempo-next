export const DESTINATION_PLAYLIST_NAME = "SpotTempo";

export const BACKGROUND_COLOR = "#cdedcc";

export const ACCESS_TOKEN_COOKIE = "STAccessToken";
export const EXPIRY_TIME_COOKIE = "STExpiryTime";
export const REFRESH_TOKEN_COOKIE = "STRefreshToken";

export const AUTH_LOADING_TEXT = "Getting logged in";
export const SEARCH_LOADING_TEXT = "Loading songs";
export const SAVED_SONGS_LOADING_TEXT = "Loading all of your saved songs";

export enum SongAction {
  ADD = "Add",
  REMOVE = "Remove",
  DISLIKE = "Dislike",
}

export enum ListType {
  SAVED_SONG = "Saved",
  ADDED_SONG = "Added",
  DISLIKED_SONG = "Disliked",
}
