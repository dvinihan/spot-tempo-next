import SongResult from "../components/SongResult";
import { Song } from "../types/Song";
import { ListType } from "../constants";
import { useSongListQuery } from "../hooks/useSongListQuery";

type Props = {
  listType: ListType;
};

const SongList = ({ listType }: Props) => {
  const songListQuery = useSongListQuery(listType);

  if (!songListQuery.data) {
    return null;
  }

  return songListQuery.data.map((song: Song) => (
    <SongResult key={song.id} song={song} />
  ));
};

export default SongList;
