import React from "react";
import Search from "./Search";
import Header from "./Header";
import { useAuth } from "../hooks/useAuth";
import { Grid, Typography } from "@mui/material";

export const App = () => {
  const { isLoading } = useAuth();

  return (
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
        {isLoading ? <Typography>Loading...</Typography> : <Search />}
      </Grid>
    </Grid>
  );
};

export default App;
