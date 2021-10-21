import { Container, Grid, Typography } from "@mui/material";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType } from "../constants";
import SongList from "../components/SongList";

const DislikedSongs = () => {
  useAuth();

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={3}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Container>
            <Typography align="center" sx={{ fontSize: 30 }}>
              Disliked Songs
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <SongCount listType={ListType.DISLIKED_SONG} />
        </Grid>
        <Grid item>
          <SongList listType={ListType.DISLIKED_SONG} />
        </Grid>
        <LoadingModal />
      </Grid>
    </>
  );
};

export default DislikedSongs;
