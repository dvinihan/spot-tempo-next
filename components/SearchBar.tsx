import { useMatchingSongs } from "../queries/songs";
import { Button, Input, Typography } from "@mui/material";
import { useAppContext } from "../context/appContext";

const SearchBar = () => {
  const { setBpm } = useAppContext();

  const getMatchingSongsQuery = useMatchingSongs();

  const handleChange = (e: any) => setBpm(parseInt(e.target.value));

  return (
    <>
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
    </>
  );
};

export default SearchBar;
