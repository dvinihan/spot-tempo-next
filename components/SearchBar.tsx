import { Button, Input, Typography } from "@mui/material";
import { useState } from "react";
import { UseMutateFunction } from "react-query";

type Props = {
  doMatchingSongsMutation: UseMutateFunction<
    any,
    unknown,
    { bpm: string },
    unknown
  >;
};

const SearchBar = ({ doMatchingSongsMutation }: Props) => {
  const [bpm, setBpm] = useState<string>("");

  const handleChange = (e: any) => setBpm(e.target.value);

  const handleSearch = () => {
    doMatchingSongsMutation({ bpm });
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
