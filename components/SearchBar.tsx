import { Button, Input, Typography } from "@mui/material";
import { useState } from "react";
import { useAppContext } from "../context/appContext";

const SearchBar = () => {
  const { matchingSongsMutation } = useAppContext();

  const [bpm, setBpm] = useState<string>("");

  const handleChange = (e: any) => setBpm(e.target.value);

  const handleSearch = () => {
    matchingSongsMutation.mutate({ bpm });
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
