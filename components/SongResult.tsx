import { truncate } from "lodash";
import { useEffect, useState } from "react";
import { useAddSong, useMatchingSongs, useRemoveSong } from "../queries/songs";
import Song from "../types/Song";
import { ButtonBase, CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";

type Props = {
  song: Song;
};

const SongResult = ({ song }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const getMatchingSongsQuery = useMatchingSongs();

  const addSongMutation = useAddSong();
  const removeSongMutation = useRemoveSong();

  // this is needed to prevent lag in color change
  useEffect(() => {
    if (!getMatchingSongsQuery.isRefetching) {
      setIsLoading(false);
    }
  }, [getMatchingSongsQuery.isRefetching]);

  const shiftSong = () => {
    if (!isLoading) {
      const mutation = song.isInDestinationPlaylist
        ? removeSongMutation
        : addSongMutation;

      setIsLoading(true);
      mutation.mutate({
        songUri: song.uri,
      });
    }
  };

  const truncatedSongName = truncate(song.name, { length: 30 });
  const truncatedArtistName = truncate(song.artist, {
    length: 30,
  });

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item>
        <ButtonBase
          sx={{
            width: "500px",
            bgcolor: song.isInDestinationPlaylist ? "#358c4e" : "#c8e2ee",
            margin: 1.5,
            padding: 1,
            borderRadius: "20px",
          }}
          onClick={() => shiftSong()}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item width={50}>
              <Typography fontSize={70} align="center">
                {song.isInDestinationPlaylist ? "-" : "+"}
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="center" fontSize={20} fontWeight={600}>
                {truncatedSongName}
              </Typography>
              <Typography align="center" fontSize={20}>
                {truncatedArtistName}
              </Typography>
              <Typography align="center" fontSize={20}>
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
