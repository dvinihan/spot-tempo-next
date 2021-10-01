import React from "react";
import styled from "styled-components/native";

const Title = styled.Text`
  font-size: 25px;
`;
const HeaderText = styled.Text`
  text-align: center;
  margin: 20px 60px;
`;

const Header = () => (
  <>
    <Title>Spotify BPM Picker</Title>
    <HeaderText>
      This app will allow you to search for songs by BPM in your Liked Songs,
      and add them to your &quot;SpotTempo&quot; playlist.
    </HeaderText>
  </>
);

export default Header;
