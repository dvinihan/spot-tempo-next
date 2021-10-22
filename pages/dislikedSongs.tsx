import { Container, Grid, Typography } from "@mui/material";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType } from "../constants";
import SongList from "../components/SongList";
import { CustomAppBar } from "../components/CustomAppBar";

const DislikedSongs = () => {
  useAuth();

  const listType = ListType.DISLIKED_SONG;

  return (
    <>
      <CustomAppBar />
      <Grid
        container
        direction="column"
        spacing={3}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 7 }}
      >
        <Grid item>
          <Container>
            <Typography align="center" sx={{ fontSize: 30 }}>
              Disliked Songs
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <SongCount listType={listType} />
        </Grid>
        <Grid item>
          <SongList listType={listType} />
        </Grid>
        <LoadingModal listType={listType} />
      </Grid>
    </>
  );
};

export default DislikedSongs;
