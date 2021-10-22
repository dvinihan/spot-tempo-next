import { Grid, Modal, Paper } from "@mui/material";
import {
  AUTH_LOADING_TEXT,
  ListType,
  SAVED_SONGS_LOADING_TEXT,
  SEARCH_LOADING_TEXT,
} from "../constants";
import { useAppContext } from "../context/appContext";
import { useSongListQuery } from "../hooks/useSongListQuery";

type Props = {
  listType: ListType;
};

const LoadingModal = ({ listType }: Props) => {
  const { loginMutation, refreshAuthMutation, reloadFromSpotifyMutation } =
    useAppContext();

  const songListQuery = useSongListQuery(listType);

  const loadingText = songListQuery.isFetching
    ? SEARCH_LOADING_TEXT
    : loginMutation.isLoading || refreshAuthMutation.isLoading
    ? AUTH_LOADING_TEXT
    : reloadFromSpotifyMutation.isLoading
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
