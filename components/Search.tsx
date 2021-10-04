import React, { useState } from "react";
import {
  getMatchingSongs,
  getSavedSongsCount,
  reloadSavedSongs,
} from "../queries/songs";
import SongResult from "./SongResult";
import { useMutation, useQuery } from "react-query";
import Song from "../types/Song";
import { Button, Grid, Input, Typography } from "@mui/material";
import { useAppContext } from "../context/appContext";

const Search = () => {
  const { accessToken } = useAppContext();

  const [bpm, setBpm] = useState<number>(0);

  const getSavedSongsCountQuery = useQuery(
    ["getSavedSongsCount", accessToken],
    () => (accessToken ? getSavedSongsCount(accessToken) : undefined)
  );
  const reloadSavedSongsMutation = useMutation("reloadSavedSongs", () =>
    reloadSavedSongs(accessToken)
  );

  const getMatchingSongsQuery = useQuery(
    "getMatchingSongs",
    () => getMatchingSongs(bpm, accessToken),
    { enabled: false }
  );

  const handleChange = (e: any) => setBpm(parseInt(e.target.value));

  const savedSongsCount =
    reloadSavedSongsMutation.data?.total ?? getSavedSongsCountQuery.data?.count;

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>
        <Typography align="center" sx={{ fontWeight: 500 }}>
          Total saved songs: {savedSongsCount}
        </Typography>
      </Grid>
      <Grid item>
        {reloadSavedSongsMutation.isLoading ? (
          <Typography>Loading all of your saved songs...</Typography>
        ) : (
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
              <Button
                onClick={() => reloadSavedSongsMutation.mutate()}
                sx={{
                  color: "black",
                  bgcolor: "lightblue",
                  ":hover": {
                    bgcolor: "white",
                  },
                }}
              >
                Reload saved songs
              </Button>
            </Grid>

            <Grid item>
              <Input onChange={handleChange} placeholder="BPM" />
              <Button
                onClick={() => getMatchingSongsQuery.refetch()}
                sx={{
                  color: "black",
                  bgcolor: "lightblue",
                  ":hover": {
                    bgcolor: "white",
                  },
                  marginLeft: 2,
                }}
              >
                <Typography>Search</Typography>
              </Button>
            </Grid>

            <Grid item>
              {getMatchingSongsQuery.data?.map((song: Song) => (
                <SongResult
                  key={song.id}
                  song={song}
                  getMatchingSongsQuery={getMatchingSongsQuery}
                />
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Search;
