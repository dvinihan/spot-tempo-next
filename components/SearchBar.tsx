import { useMatchingSongs } from "../queries/songs";
import { Button, Input, Typography } from "@mui/material";
import { useAppContext } from "../context/appContext";
import { SEARCH_LOADING_TEXT } from "../constants";

const SearchBar = () => {
  const { bpm, setBpm, setLoadingText } = useAppContext();

  const getMatchingSongsQuery = useMatchingSongs();

  const handleChange = (e: any) => setBpm(e.target.value);

  const handleSearch = () => {
    setLoadingText(SEARCH_LOADING_TEXT);
    getMatchingSongsQuery.refetch();
  };

  return (
    <>
      <Input
        onChange={handleChange}
        placeholder="BPM"
        type="number"
        value={bpm}
      />
      <Button
        onClick={handleSearch}
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
    </>
  );
};

export default SearchBar;
