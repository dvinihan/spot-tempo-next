import { CircularProgress, Grid, Typography } from "@mui/material";

type Props = {
  text: string;
  isLoading: boolean;
};

const LoadingIndicator = ({ text, isLoading }: Props) => {
  if (!isLoading) {
    return null;
  }

  return (
    <Grid container>
      <Grid item>
        <Typography fontSize="12px">{text}</Typography>
      </Grid>
      <Grid item>
        <CircularProgress size="12px" />
      </Grid>
    </Grid>
  );
};

export default LoadingIndicator;
