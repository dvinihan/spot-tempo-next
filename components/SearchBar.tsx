import { useMatchingSongs } from "../queries/songs";
import { Button, Input, Typography } from "@mui/material";
import { useState } from "react";

const SearchBar = () => {
  const [bpm, setBpm] = useState<string>("");

  const getMatchingSongsQuery = useMatchingSongs(bpm);

  const handleChange = (e: any) => setBpm(e.target.value);

  const handleSearch = () => {
    getMatchingSongsQuery.refetch();
  };

  const onKeyPress = (e: any) => {
    if (e.key == "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Input
        onChange={handleChange}
        onKeyPress={onKeyPress}
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
