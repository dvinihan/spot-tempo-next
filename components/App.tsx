import Header from "./Header";
import { Grid } from "@mui/material";
import SongResult from "./SongResult";
import SearchBar from "./SearchBar";
import ReloadButton from "./ReloadButton";
import { useMatchingSongs } from "../queries/songs";
import Song from "../types/Song";
import SongCount from "./SongCount";
import LoadingModal from "./LoadingModal";
import { useAuth } from "../hooks/useAuth";

export const App = () => {
  useAuth();

  const getMatchingSongsQuery = useMatchingSongs();

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
          <Header />
        </Grid>
        <Grid item>
          <SongCount />
        </Grid>
        <Grid item>
          <ReloadButton />
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
