import { Button, Input, Typography } from "@mui/material";
import { useState } from "react";
import { ListType } from "../constants";
import { useSongListQuery } from "../hooks/useSongListQuery";

const SearchBar = () => {
  const [bpm, setBpm] = useState<string>("");

  const songListQuery = useSongListQuery(ListType.SAVED_SONG, bpm);

  const handleChange = (e: any) => setBpm(e.target.value);

  const handleSearch = () => {
    songListQuery.refetch();
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
