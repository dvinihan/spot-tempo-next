import { Container, Typography } from "@mui/material";

const Header = () => (
  <Container>
    <Typography align="center" sx={{ fontSize: 30 }}>
      Spotify BPM Picker
    </Typography>
    <Typography align="center" sx={{ fontSize: 16 }}>
      This app will allow you to search for songs by BPM in your Liked Songs,
      and add them to your &quot;SpotTempo&quot; playlist.
    </Typography>
  </Container>
);

export default Header;
