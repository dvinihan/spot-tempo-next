import { truncate } from "lodash";
import { Song } from "../types/Song";
import { ButtonBase, CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getAuthCookies } from "../util/cookies";
import { useMutation } from "react-query";
import { ADD, REMOVE } from "../constants";
import { addOrRemoveSong } from "../mutationFunctions/songs";

type Props = {
  song: Song;
};

const SongResult = ({ song }: Props) => {
  const { accessTokenCookie } = getAuthCookies();

  const { data, isLoading, mutate } = useMutation(addOrRemoveSong);

  const isInPlaylist =
    data?.isInDestinationPlaylist ?? song.isInDestinationPlaylist;

  const shiftSong = () => {
    if (!isLoading) {
      mutate({
        songUri: song.uri,
        accessTokenCookie,
        action: isInPlaylist ? REMOVE : ADD,
      });
    }
  };

  const truncatedSongName = truncate(song.name, { length: 30 });
  const truncatedArtistName = truncate(song.artist, {
    length: 30,
  });

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item width="100%">
        <ButtonBase
          sx={{
            width: "100%",
            bgcolor: isInPlaylist ? "#358c4e" : "#c8e2ee",
            marginTop: 1.5,
            marginBottom: 1.5,
            padding: 1,
            borderRadius: "20px",
          }}
          onClick={shiftSong}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item width={50}>
              <Typography fontSize={60} align="center">
                {isInPlaylist ? "-" : "+"}
              </Typography>
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
            <Grid item width={50} />
          </Grid>
          {isLoading && (
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                position: "absolute",
                left: 0,
                borderRadius: "20px",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </ButtonBase>
      </Grid>
    </Grid>
  );
};

export default SongResult;
