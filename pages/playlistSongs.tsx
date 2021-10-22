import { Container, Grid, Typography } from "@mui/material";
import SongCount from "../components/SongCount";
import LoadingModal from "../components/LoadingModal";
import { useAuth } from "../hooks/useAuth";
import { ListType } from "../constants";
import SongList from "../components/SongList";
import { CustomAppBar } from "../components/CustomAppBar";
import { useCallback } from "react";
import { getLoadingModalText } from "../helpers";
import { useSongListQuery } from "../hooks/useSongListQuery";

const AddedSongs = () => {
  const listType = ListType.PLAYLIST_SONG;

  const { isAuthLoading } = useAuth();

  const songListQuery = useSongListQuery(listType);

  const loadingModalTextCallback = useCallback(
    () => getLoadingModalText(songListQuery.isFetching, isAuthLoading, false),
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
          <SongCount listType={listType} />
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
