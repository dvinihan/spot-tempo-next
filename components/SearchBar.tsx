import { Button, Input, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { ListType } from "../constants";
import { getSongList } from "../mutationFunctions/songs";
import { getAuthCookies } from "../util/cookies";

const SearchBar = () => {
  const [bpm, setBpm] = useState<string>("");

  const { accessTokenCookie } = getAuthCookies();

  const songListQuery = useQuery(
    ["getSongList"],
    () =>
      getSongList({ bpm, accessTokenCookie, listType: ListType.SAVED_SONG }),
    { enabled: false }
  );

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
