import { Button, Container, Grid, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType } from "../constants";
import SongList from "../components/SongList";
import { useAppContext } from "../context/appContext";
import { CustomAppBar } from "../components/CustomAppBar";

const SavedSongs = () => {
  useAuth();

  const { reloadFromSpotifyMutation } = useAppContext();

  const handleReload = () => reloadFromSpotifyMutation.mutate();

  const listType = ListType.SAVED_SONG;

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
            <Typography align="center" sx={{ fontSize: 16 }}>
              This app will allow you to search for songs by BPM in your Liked
              Songs, and add them to your &quot;SpotTempo&quot; playlist.
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <SongCount listType={listType} />
        </Grid>
        <Grid item>
          <Button
            onClick={handleReload}
            sx={{
              color: "black",
              bgcolor: "lightblue",
              ":hover": {
                bgcolor: "white",
              },
            }}
          >
            Reload from Spotify
          </Button>
        </Grid>
        <Grid item>
          <SearchBar />
        </Grid>
        <Grid item>
          <SongList listType={listType} />
        </Grid>
        <LoadingModal listType={listType} />
      </Grid>
    </>
  );
};

export default SavedSongs;
