import { Button, Input, Typography } from "@mui/material";
import { useState } from "react";
import { ListType } from "../constants";
import { useSongListQuery } from "../hooks/useSongListQuery";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const songListQuery = useSongListQuery(ListType.SAVED_SONG, searchTerm);

  const handleChange = (e: any) => setSearchTerm(e.target.value);

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
        placeholder="Song name"
        value={searchTerm}
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
