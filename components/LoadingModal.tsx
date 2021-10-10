import { Grid, Modal, Paper } from "@mui/material";
import {
  AUTH_LOADING_TEXT,
  SAVED_SONGS_LOADING_TEXT,
  SEARCH_LOADING_TEXT,
} from "../constants";
import { useAppContext } from "../context/appContext";

type Props = {
  isMatchingSongsMutationLoading: boolean;
};

const LoadingModal = ({ isMatchingSongsMutationLoading }: Props) => {
  const { loginMutation, refreshMutation, reloadSavedSongsMutation } =
    useAppContext();

  const loadingText = isMatchingSongsMutationLoading
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
