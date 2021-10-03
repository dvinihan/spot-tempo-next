import { truncate } from "lodash";
import styled from "styled-components/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useMutation, UseQueryResult } from "react-query";
import { useAppContext } from "../context/appContext";
import { addSong, removeSong } from "../queries/songs";
import Song from "../types/Song";

const TouchableSongView = styled.TouchableHighlight`
  margin: 12px;
  padding: 10px;
  border-radius: 20px;
  background-color: ${(props: any) =>
    props.isInDestinationPlaylist ? "#358c4e" : "#c8e2ee"};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
` as any;
const Spacer = styled.View`
  width: 50px;
`;
const AddRemoveText = styled.Text`
  font-size: 50px;
`;
const SongInfo = styled.View`
  margin: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SongName = styled.Text`
  font-weight: 600;
  font-size: 20px;
`;
const SongDetail = styled.Text`
  font-size: 20px;
`;
const LoadingView = styled.View`
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 0;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  song: Song;
  getMatchingSongsQuery: UseQueryResult;
};

const SongResult = ({ song, getMatchingSongsQuery }: Props) => {
  const { accessToken } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  // this is needed to prevent lag in color change
  useEffect(() => {
    if (!getMatchingSongsQuery.isRefetching) {
      setIsLoading(false);
    }
  }, [getMatchingSongsQuery.isRefetching]);

  const addSongMutation = useMutation("addSong", () =>
    addSong(song.uri, getMatchingSongsQuery, accessToken)
  );
  const removeSongMutation = useMutation("removeSong", () =>
    removeSong(song.uri, getMatchingSongsQuery, accessToken)
  );

  const shiftSong = () => {
    if (!isLoading) {
      const mutation = song.isInDestinationPlaylist
        ? removeSongMutation
        : addSongMutation;

      setIsLoading(true);
      mutation.mutate();
    }
  };

  const truncatedSongName = truncate(song.name, { length: 30 });
  const truncatedArtistName = truncate(song.artist, {
    length: 30,
  });

  return (
    <TouchableSongView
      isInDestinationPlaylist={song.isInDestinationPlaylist}
      onPress={() => shiftSong()}
    >
      {/* Touchable requires one child only */}
      <>
        <AddRemoveText>
          {song.isInDestinationPlaylist ? "-" : "+"}
        </AddRemoveText>

        <SongInfo>
          <SongName>{truncatedSongName}</SongName>
          <SongDetail>{truncatedArtistName}</SongDetail>
          <SongDetail>{song.tempo} BPM</SongDetail>
        </SongInfo>

        <Spacer />

        {isLoading && (
          <LoadingView>
            <ActivityIndicator size="large" />
          </LoadingView>
        )}
      </>
    </TouchableSongView>
  );
};

export default SongResult;