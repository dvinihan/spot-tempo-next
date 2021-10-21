import { Grid, Modal, Paper } from "@mui/material";
import { useQuery } from "react-query";
import {
  AUTH_LOADING_TEXT,
  ListType,
  SAVED_SONGS_LOADING_TEXT,
  SEARCH_LOADING_TEXT,
} from "../constants";
import { useAppContext } from "../context/appContext";
import { getSongList } from "../mutationFunctions/songs";
import { getAuthCookies } from "../util/cookies";

const LoadingModal = () => {
  const { loginMutation, refreshMutation, reloadSavedSongsMutation } =
    useAppContext();

  const { accessTokenCookie } = getAuthCookies();

  const songListQuery = useQuery(
    ["getSongList"],
    () => getSongList({ accessTokenCookie, listType: ListType.SAVED_SONG }),
    { enabled: false }
  );

  const loadingText = songListQuery.isLoading
    ? SEARCH_LOADING_TEXT
    : loginMutation.isLoading || refreshMutation.isLoading
    ? AUTH_LOADING_TEXT
    : reloadSavedSongsMutation.isLoading
    ? SAVED_SONGS_LOADING_TEXT
    : "";

  return (
    <Modal open={Boolean(loadingText)}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Grid item>
          <Paper
            sx={{
              fontSize: "25px",
              padding: "30px",
            }}
          >
            {loadingText}
          </Paper>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default LoadingModal;
