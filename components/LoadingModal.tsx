import { useAuth } from "../hooks/useAuth";
import { Grid, Modal, Paper } from "@mui/material";
import { useMatchingSongs, useReloadSavedSongs } from "../queries/songs";

const LoadingModal = () => {
  const { isAuthenticating } = useAuth();

  const reloadSavedSongsMutation = useReloadSavedSongs();
  const getMatchingSongsQuery = useMatchingSongs();

  const loadingText = isAuthenticating
    ? "Getting logged in"
    : reloadSavedSongsMutation.isLoading
    ? "Loading all of your saved songs"
    : getMatchingSongsQuery.isLoading
    ? "Loading songs"
    : undefined;

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
