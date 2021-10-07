import { Grid, Modal, Paper } from "@mui/material";
import { useAppContext } from "../context/appContext";

const LoadingModal = () => {
  const { loadingText } = useAppContext();

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
