import { AUTH_LOADING_TEXT, SEARCH_LOADING_TEXT } from "../constants";

export const getLoadingModalText = (
  isSearchLoading: boolean,
  isAuthLoading: boolean
) =>
  isSearchLoading
    ? SEARCH_LOADING_TEXT
    : isAuthLoading
    ? AUTH_LOADING_TEXT
    : "";
