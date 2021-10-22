import { Grid, Modal, Paper, Typography } from "@mui/material";
type Props = {
  text: string;
  isLoading: boolean;
};

const LoadingModal = ({ text, isLoading }: Props) => {
  return (
    <Modal open={isLoading}>
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
            <Typography fontSize={30}>{text}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default LoadingModal;
