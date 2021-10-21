import { truncate } from "lodash";
import { Song } from "../types/Song";
import { ButtonBase, CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getAuthCookies } from "../util/cookies";
import { useMutation } from "react-query";
import { modifySong } from "../mutationFunctions/songs";
import { SongAction } from "../constants";

type Props = {
  song: Song;
};

const SongResult = ({ song }: Props) => {
  const { accessTokenCookie } = getAuthCookies();

  const { data, isLoading, mutate } = useMutation(modifySong);

  const isInPlaylist = data?.isInPlaylist ?? song.isInPlaylist;
  const isDisliked = data?.isDisliked ?? song.isDisliked;

  const shiftSong = () => {
    if (!isLoading) {
      mutate({
        songUri: song.uri,
        accessTokenCookie,
        action: isInPlaylist ? SongAction.REMOVE : SongAction.ADD,
      });
    }
  };

  const dislikeSong = () => {
    if (!isLoading) {
      mutate({
        songUri: song.uri,
        accessTokenCookie,
        action: SongAction.DISLIKE,
      });
    }
  };

  const truncatedSongName = truncate(song.name, { length: 30 });
  const truncatedArtistName = truncate(song.artist, {
    length: 30,
  });

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ position: "relative" }}
      >
        <Grid
          item
          width="100%"
          sx={{
            width: "100%",
            bgcolor: isDisliked
              ? "#e94f4f"
              : isInPlaylist
              ? "#358c4e"
              : "#c8e2ee",
            marginTop: 1.5,
            marginBottom: 1.5,
            padding: 1,
            borderRadius: "20px",
          }}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item width={50} sx={{ textAlign: "center" }}>
              <ButtonBase onClick={shiftSong}>
                <Typography fontSize={60} align="center">
                  {isInPlaylist ? "-" : "+"}
                </Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <Typography align="center" fontSize={17} fontWeight={600}>
                {truncatedSongName}
              </Typography>
              <Typography align="center" fontSize={17}>
                {truncatedArtistName}
              </Typography>
              <Typography align="center" fontSize={17}>
                {song.tempo} BPM
              </Typography>
            </Grid>
            <Grid item width={50} sx={{ textAlign: "center" }}>
              <ButtonBase onClick={dislikeSong}>
                <Typography fontSize={50} align="center">
                  X
                </Typography>
              </ButtonBase>
            </Grid>
          </Grid>
        </Grid>
        {isLoading && (
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              position: "absolute",
              borderRadius: "20px",
              width: "100%",
              height: "82%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Grid>
    </>
  );
};

export default SongResult;
