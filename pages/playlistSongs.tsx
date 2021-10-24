import { Container, Grid, Typography } from "@mui/material";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType, SYNCING_SPOTIFY_TEXT } from "../constants";
import SongList from "../components/SongList";
import { CustomAppBar } from "../components/CustomAppBar";
import { useCallback } from "react";
import { getLoadingModalText } from "../helpers";
import { useSongListQuery } from "../hooks/useSongListQuery";
import { useSpotifySync } from "../hooks/useSpotifySync";
import LoadingIndicator from "../components/LoadingIndicator";

type Props = {
  hasDoneFirstSongLoad: boolean;
  setHasDoneFirstSongLoad: (hasDoneFirstSongLoad: boolean) => void;
};

const AddedSongs = ({
  hasDoneFirstSongLoad,
  setHasDoneFirstSongLoad,
}: Props) => {
  const listType = ListType.PLAYLIST_SONG;

  const { isAuthLoading } = useAuth();
  const { isSpotifySyncing } = useSpotifySync(
    listType,
    hasDoneFirstSongLoad,
    setHasDoneFirstSongLoad
  );

  const songListQuery = useSongListQuery(listType);

  const loadingModalTextCallback = useCallback(
    () => getLoadingModalText(songListQuery.isFetching, isAuthLoading),
    [songListQuery.isFetching, isAuthLoading]
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
            <Typography align="center" sx={{ fontSize: 30 }}>
              Added Songs
            </Typography>
          </Container>
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <SongCount listType={listType} />
            </Grid>
            <Grid item>
              <LoadingIndicator
                text={SYNCING_SPOTIFY_TEXT}
                isLoading={isSpotifySyncing}
              />
            </Grid>
          </Grid>
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

export default AddedSongs;
