import { Button, Container, Grid, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType } from "../constants";
import SongList from "../components/SongList";
import { CustomAppBar } from "../components/CustomAppBar";
import { useMutation } from "react-query";
import { reloadFromSpotify } from "../mutationFunctions/songs";
import { useSongCountQuery } from "../hooks/useSongCountQuery";
import { getAuthCookies } from "../util/cookies";
import { useSongListQuery } from "../hooks/useSongListQuery";
import { useCallback } from "react";
import { getLoadingModalText } from "../helpers";

const SavedSongs = () => {
  const listType = ListType.SAVED_SONG;

  const { isAuthLoading } = useAuth();

  const { accessTokenCookie } = getAuthCookies();

  const songCountQuery = useSongCountQuery(listType);
  const songListQuery = useSongListQuery(listType);

  const reloadFromSpotifyMutation = useMutation(
    () => reloadFromSpotify({ accessTokenCookie }),
    {
      onSuccess: () => {
        songCountQuery.refetch();
      },
    }
  );

  const handleReload = () => reloadFromSpotifyMutation.mutate();

  const loadingModalTextCallback = useCallback(
    () =>
      getLoadingModalText(
        songListQuery.isFetching,
        isAuthLoading,
        reloadFromSpotifyMutation.isLoading
      ),
    [
      songListQuery.isFetching,
      isAuthLoading,
      reloadFromSpotifyMutation.isLoading,
    ]
  );

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
        <LoadingModal
          text={loadingModalTextCallback()}
          isLoading={Boolean(loadingModalTextCallback())}
        />
      </Grid>
    </>
  );
};

export default SavedSongs;
