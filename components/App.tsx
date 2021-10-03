import React from "react";
import Search from "./Search";
import Header from "./Header";
import { useAuth } from "../hooks/useAuth";
import { Container, Grid, Typography } from "@mui/material";

export const App = () => {
  const { isLoading } = useAuth();

  return (
    <Container>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Header />
        </Grid>
        <Grid item>
          {isLoading ? <Typography>Loading...</Typography> : <Search />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
