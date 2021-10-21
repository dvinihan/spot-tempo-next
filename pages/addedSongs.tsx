import { Container, Grid, Typography } from "@mui/material";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType } from "../constants";
import SongList from "../components/SongList";

const AddedSongs = () => {
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
              Added Songs
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <SongCount listType={ListType.ADDED_SONG} />
        </Grid>
        <Grid item>
          <SongList listType={ListType.ADDED_SONG} />
        </Grid>
        <LoadingModal />
      </Grid>
    </>
  );
};

export default AddedSongs;
