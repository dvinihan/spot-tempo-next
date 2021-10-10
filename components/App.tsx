import { Button, Container, Grid, Typography } from "@mui/material";
import SongResult from "./SongResult";
import SearchBar from "./SearchBar";
import { useMatchingSongs } from "../queries/songs";
import { Song } from "../types/Song";
import SongCount from "./SongCount";
import LoadingModal from "./LoadingModal";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { getAuthCookies } from "../util/cookies";
import { useAppContext } from "../context/appContext";

const authParams = new URLSearchParams({
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID || "",
  response_type: "code",
  redirect_uri: process.env.NEXT_PUBLIC_BASE_URL || "",
  scope: [
    "playlist-read-private",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-library-read",
  ].join(" "),
});

export const App = () => {
  const router = useRouter();
  const { code } = router.query;

  const { loginMutation, refreshMutation, reloadSavedSongsMutation } =
    useAppContext();

  // mutation changes would trigger a useEffect refresh on every render, so we need to isolate the mutate fn only
  const { mutate: doLogin } = loginMutation;
  const { mutate: doRefresh } = refreshMutation;

  const getMatchingSongsQuery = useMatchingSongs();

  useEffect(() => {
    if (!router.isReady) return;

    if (code) {
      doLogin({ code: code as string });
      return;
    }

    const { accessTokenCookie, expiryTimeCookie, refreshTokenCookie } =
      getAuthCookies();

    const isExpired = expiryTimeCookie
      ? Date.now() > parseInt(expiryTimeCookie)
      : true;

    if (accessTokenCookie && refreshTokenCookie && isExpired) {
      doRefresh({ refreshToken: refreshTokenCookie });
      return;
    }

    if (!accessTokenCookie) {
      router.push(
        "https://accounts.spotify.com/authorize?".concat(authParams.toString())
      );
    }
  }, [code, doLogin, doRefresh, router]);

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
          <SongCount />
        </Grid>
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
          <SearchBar />
        </Grid>
        {getMatchingSongsQuery.isSuccess && (
          <Grid item>
            {getMatchingSongsQuery.data?.map((song: Song) => (
              <SongResult key={song.id} song={song} />
            ))}
          </Grid>
        )}
      </Grid>
      <LoadingModal />
    </>
  );
};

export default App;
