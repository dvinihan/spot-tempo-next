import {
  AUTH_LOADING_TEXT,
  SAVED_SONGS_LOADING_TEXT,
  SEARCH_LOADING_TEXT,
} from "../constants";

export const getLoadingModalText = (
  isSearchLoading: boolean,
  isAuthLoading: boolean,
  isReloading: boolean
) =>
  isSearchLoading
    ? SEARCH_LOADING_TEXT
    : isAuthLoading
    ? AUTH_LOADING_TEXT
    : isReloading
    ? SAVED_SONGS_LOADING_TEXT
    : "";
