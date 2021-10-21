import { Container, Grid, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType } from "../constants";
import SongList from "../components/SongList";

const SavedSongs = () => {
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
              Spotify BPM Picker
            </Typography>
            <Typography align="center" sx={{ fontSize: 16 }}>
              This app will allow you to search for songs by BPM in your Liked
              Songs, and add them to your &quot;SpotTempo&quot; playlist.
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <Container>
            <Typography align="center" sx={{ fontSize: 30 }}>
              Matching Songs
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <SongCount listType={ListType.SAVED_SONG} />
        </Grid>
        <Grid item>
          <SearchBar />
        </Grid>
        <Grid item>
          <SongList listType={ListType.SAVED_SONG} />
        </Grid>
        <LoadingModal />
      </Grid>
    </>
  );
};

export default SavedSongs;
